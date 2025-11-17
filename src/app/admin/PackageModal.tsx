import { getAllCourses } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import { TOAST_DEFAULT_CONFIG, TOAST_DEFAULT_MESSAGE } from "../constants";
import { Course } from "../models/course";
import { CoursePackage } from "../models/course-package";
import { Button } from "../ui/components/Button";
import { LoadingSpinner } from "../ui/components/LoadingSpinner";
import { CustomModalRef, Modal } from "../ui/components/Modal";

interface CoursePackageModalProps {
  onClose: (data?: { package: CoursePackage; edit?: boolean }) => void;
  editCoursePackage?: CoursePackage;
}

interface CoursePackageModalForm {
  title: string;
  description: string;
  price: number;
  mediaUrl: string;
  slug?: string;
  courseIds: string[];
}

export const PackageModal = ({
  onClose,
  editCoursePackage,
}: CoursePackageModalProps) => {
  const modalRef = useRef<CustomModalRef>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionPerforming, setActionPerforming] = useState(false);
  const { register, handleSubmit, setValue, getValues } =
    useForm<CoursePackageModalForm>({
      defaultValues: {
        title: editCoursePackage?.title || "",
        price: editCoursePackage?.price,
        description: editCoursePackage?.description || "",
        mediaUrl: editCoursePackage?.mediaUrl || "",
        slug: editCoursePackage?.slug || "",
        courseIds:
          (editCoursePackage?.courseIds || []).map((id) => id.toString()) || [],
      },
    });

  useEffect(() => {
    const title = getValues("title");
    if (!editCoursePackage && title) {
      setValue("slug", slugify(title, { lower: true }));
    }

    setIsLoading(true);
    getAllCourses()
      .then((fetchedCourses) => {
        setCourses(fetchedCourses);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching courses:", error);
        toast.error("Error fetching courses", TOAST_DEFAULT_CONFIG);
        setIsLoading(false);
      });
  }, []);

  const onSubmit = async (data: CoursePackageModalForm) => {
    if (actionPerforming) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Missing access token. Please log in!", TOAST_DEFAULT_CONFIG);
      return;
    }

    setActionPerforming(true);
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const body = {
        ...data,
        price: +data.price,
        id: editCoursePackage?.id,
        courseIds: data.courseIds,
        slug: data.slug || slugify(data.title, { lower: true }),
      };

      const url = "/api/admin/course-package";
      if (editCoursePackage) (body as any).courseId = editCoursePackage.id;

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Course operation failed");

      modalRef.current?.closeModal({
        package: {
          ...body,
          id: json.id,
          createdAt: json.createdAt,
          updatedAt: json.updatedAt,
        },
        edit: !!editCoursePackage,
      });
    } catch (error) {
      console.error(error);
      toast.error(TOAST_DEFAULT_MESSAGE, TOAST_DEFAULT_CONFIG);
      setActionPerforming(false);
    }
  };

  return (
    <Modal onClose={onClose} small ref={modalRef}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl mx-auto bg-white/60 backdrop-blur-md border border-[#d0e7ff] rounded-2xl p-8 shadow-xl space-y-6"
        >
          <div>
            <label className="block font-bold mb-2">Titel</label>
            <input
              {...register("title", { required: true })}
              placeholder="Kurs Titel"
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Kurse</label>
            {courses.map((course) => (
              <label
                key={course.id}
                className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:shadow-sm transition bg-white/40"
              >
                <input
                  type="checkbox"
                  value={course.id.toString()}
                  {...register("courseIds", { required: true })}
                  className="h-4 w-4"
                />
                <span className="text-sm">{course.title}</span>
              </label>
            ))}
            {/* <select
              multiple
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register("courseLinks", { required: true })}
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select> */}
          </div>

          <div>
            <label className="block font-bold mb-2">Beschreibung</label>
            <textarea
              {...register("description")}
              placeholder="Kurs Beschreibung"
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Bild URL</label>
            <input
              {...register("mediaUrl", { required: true })}
              placeholder="Bild URL"
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Preis (€)</label>
            <input
              type="number"
              {...register("price", { required: true })}
              placeholder="e.g. 19.99"
            />
          </div>

          {/* <div>
            <label className="block font-bold mb-2">Slug</label>
            <input {...register("slug")} placeholder="Slug (optional)" />
          </div> */}

          <div className="pt-4">
            <Button type="submit" disabled={actionPerforming}>
              Package speichern
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
