import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import { TOAST_DEFAULT_CONFIG, TOAST_DEFAULT_MESSAGE } from "../constants";
import { generateRandomString } from "../helpers";
import { Course } from "../models/course";
import { Button } from "../ui/components/Button";
import { CustomModalRef, Modal } from "../ui/components/Modal";

interface CourseModalProps {
  onClose: (data?: { course: Course; edit?: boolean }) => void;
  editCourse?: Course;
}

interface CourseModalForm {
  title: string;
  description: string;
  price: number;
  mediaUrl: string;
  slug?: string;
  discount?: number;
  discountExpiresAt?: string;
  tags?: string; // comma-separated
}

export const CourseModal = ({ onClose, editCourse }: CourseModalProps) => {
  const modalRef = useRef<CustomModalRef>(null);
  const [actionPerforming, setActionPerforming] = useState(false);

  const { register, handleSubmit, setValue, getValues } =
    useForm<CourseModalForm>({
      defaultValues: {
        title: editCourse?.title || "",
        price: editCourse?.price || 0,
        description: editCourse?.description || "",
        mediaUrl: editCourse?.mediaUrl || "",
        slug: editCourse?.slug || "",
        discount: editCourse?.discount || 0,
        discountExpiresAt: editCourse?.discountExpiresAt
          ? new Date(editCourse.discountExpiresAt).toISOString().slice(0, 16)
          : "",
        //@ts-ignore
        tags: editCourse?.tags?.map((t) => t.name).join(", ") || "",
      },
    });

  useEffect(() => {
    const title = getValues("title");
    if (!editCourse && title) {
      setValue("slug", slugify(title, { lower: true }));
    }
  }, []);

  const onSubmit = async (data: CourseModalForm) => {
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
        discount: data.discount ? +data.discount : 0,
        discountExpiresAt: data.discountExpiresAt
          ? new Date(data.discountExpiresAt).toISOString()
          : undefined,
        courseCode: generateRandomString(6),
        tags: data.tags?.split(",").map((tag) => tag.trim()),
        slug: data.slug || slugify(data.title, { lower: true }),
      };

      const method = editCourse ? "PUT" : "POST";
      const url = "/api/admin/course";
      if (editCourse) (body as any).courseId = editCourse.id;

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Course operation failed");

      modalRef.current?.closeModal({
        course: json,
        edit: !!editCourse,
      });

      setActionPerforming(false);
    } catch (error) {
      console.error(error);
      toast.error(TOAST_DEFAULT_MESSAGE, TOAST_DEFAULT_CONFIG);
      setActionPerforming(false);
    }
  };

  return (
    <Modal onClose={onClose} small ref={modalRef}>
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

        <div>
          <label className="block font-bold mb-2">Discount (%)</label>
          <input
            type="number"
            {...register("discount")}
            placeholder="e.g. 20"
            min={0}
            max={100}
          />
        </div>

        <div>
          <label className="block font-bold mb-2">Discount Ablauf</label>
          <input type="datetime-local" {...register("discountExpiresAt")} />
        </div>

        {/* <div>
          <label className="block font-bold mb-2">Slug</label>
          <input {...register("slug")} placeholder="Custom slug (optional)" />
        </div> */}

        <div>
          <label className="block font-bold mb-2">Tags (comma-separated)</label>
          <input
            {...register("tags")}
            placeholder="e.g. programming, javascript, frontend"
          />
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={actionPerforming}>
            Kurs speichern
          </Button>
        </div>
      </form>
    </Modal>
  );
};
