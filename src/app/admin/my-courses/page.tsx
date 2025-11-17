"use client";

import { TOAST_DEFAULT_CONFIG } from "@/app/constants";
import withProtectedAdminPage from "@/app/context/admin/withProtectedAdminPage";
import { useModal } from "@/app/hooks/useModal";
import { Course } from "@/app/models/course";
import { CoursePackage } from "@/app/models/course-package";
import { Button } from "@/app/ui/components/Button";
import { ParticipantsModal } from "@/app/ui/components/ParticipantsModal";
import { Robot } from "@/app/ui/components/Robot";
import { getAllCourses, getAllPackages } from "@/lib/api";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { MdOutlineSchool } from "react-icons/md";
import { toast } from "react-toastify";
import { CourseModal } from "../CourseModal";
import { PackageModal } from "../PackageModal";

function MyCourses() {
  const { modal, openModal, closeModal } = useModal();
  const [courses, setCourses] = useState<Course[]>([]);
  const [packages, setPackages] = useState<CoursePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editCourse, setEditCourse] = useState<Course>();

  const onCourseModalClose = (data?: { course: Course; edit?: boolean }) => {
    if (data) {
      if (data.edit) {
        setCourses(
          courses.map((c) => (c.id === data.course.id ? data.course : c))
        );
      } else {
        setCourses([data.course, ...courses]);
      }
    }
    setEditCourse(undefined);
    closeModal();
  };

  const onPackageModalClose = (data?: {
    package: CoursePackage;
    edit?: boolean;
  }) => {
    if (data) {
      if (data.edit) {
        setPackages(
          packages.map((c) => (c.id === data.package.id ? data.package : c))
        );
      } else {
        setPackages([data.package, ...packages]);
      }
    }
    setEditCourse(undefined);
    closeModal();
  };

  const onEditCourse = (course: Course) => {
    setEditCourse(course);
    showAddCourseModal();
  };

  const onEditPackage = (pkg: CoursePackage) => {
    openModal(
      <PackageModal onClose={onPackageModalClose} editCoursePackage={pkg} />
    );
  };

  const showAddCourseModal = () => {
    openModal(
      <CourseModal onClose={onCourseModalClose} editCourse={editCourse} />
    );
  };

  const showAddPackageModal = () => {
    openModal(<PackageModal onClose={onPackageModalClose} />);
  };

  const showParticipantsModal = (participants: any) => {
    openModal(
      <ParticipantsModal
        participants={participants}
        onClose={() => closeModal()}
      />
    );
  };

  const handleViewParticipants = async (e, courseId: string) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/get-participants?courseId=${courseId}`);
      if (!res.ok) throw new Error("Failed to fetch participants");
      const data = await res.json();
      showParticipantsModal(data);
    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to fetch participants. Please try again later.",
        TOAST_DEFAULT_CONFIG
      );
    }
  };

  useEffect(() => {
    Promise.all([getAllCourses(), getAllPackages()])
      .then(([courses, packages]) => {
        setPackages(packages);
        setIsLoading(false);
        setCourses(courses);
      })
      .catch((err: any) => {
        console.error("Error getting all courses:", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Robot />;
  }
  return (
    <>
      <div className="w-[95%] max-w-7xl z-10 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/60 backdrop-blur-lg border border-[#d0e7ff] rounded-3xl shadow-2xl p-10"
        >
          <div className="flex  items-center mb-8">
            <h1 className="text-3xl mb-0 sm:text-xl font-extrabold text-[#003366]">
              Meine Kurse
            </h1>
            <button
              onClick={() => showAddCourseModal()}
              className="inline-flex ml-auto items-center gap-2 px-6 py-3 sm:px-3 sm:py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full shadow hover:shadow-lg hover:scale-105 transition"
            >
              <MdOutlineSchool size={20} />
              Kurs hinzufügen
            </button>

            <button
              onClick={() => showAddPackageModal()}
              className="inline-flex ml-4 items-center gap-2 px-6 py-3 sm:px-3 sm:py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full shadow hover:shadow-lg hover:scale-105 transition"
            >
              <MdOutlineSchool size={20} />
              Kurspackage hinzufügen
            </button>
          </div>

          <div className="grid gap-6  w-full">
            {courses.length === 0 && (
              <div className="text-center text-gray-700 font-semibold">
                Keine Kurse vorhanden!
              </div>
            )}
            <div
              className={`w-full flex items-center gap-5 flex-wrap  ${courses.length > 1 && "justify-center"}`}
            >
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="relative  bg-white/40 backdrop-blur-sm border border-[#d0e7ff] rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all p-6 flex flex-col justify-between sm:p-2"
                >
                  <div className="relative h-40 w-[300px] sm:w-[220px] rounded-xl overflow-hidden mb-4">
                    <Image
                      src={pkg.mediaUrl || "/course-bg.jpg"}
                      alt={pkg.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/70 to-transparent" />
                  </div>
                  <h2 className="text-lg font-bold text-[#003366] mb-2">
                    {pkg.title}
                  </h2>
                  <div className="flex justify-end gap-4 mt-auto">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.preventDefault();
                        onEditPackage(pkg);
                      }}
                    >
                      <FaPencil size={20} />
                    </button>
                  </div>
                </div>
              ))}

              {courses.map((course) => (
                <div
                  key={course.id}
                  className="relative  bg-white/40 backdrop-blur-sm border border-[#d0e7ff] rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all p-6 flex flex-col justify-between sm:p-2"
                >
                  <div className="relative h-40 w-[300px] sm:w-[220px] rounded-xl overflow-hidden mb-4">
                    <Image
                      src={course.mediaUrl || "/course-bg.jpg"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/70 to-transparent" />
                  </div>
                  <h2 className="text-lg font-bold text-[#003366] mb-2">
                    {course.title}
                  </h2>
                  <div className="flex justify-end gap-4 mt-auto">
                    <Button
                      onClick={(e) =>
                        handleViewParticipants(e, String(course.id))
                      }
                    >
                      Teilnehmer
                    </Button>

                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.preventDefault();
                        onEditCourse(course);
                      }}
                    >
                      <FaPencil size={20} />
                    </button>
                    {/* <button
                      type="button"
                      className="text-red-600 hover:text-red-800"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenDelteCourseModal(course);
                      }}
                    >
                      <RiDeleteBinLine size={20} />
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {modal}
        </motion.div>
      </div>
    </>
  );
}

export default withProtectedAdminPage(MyCourses);
