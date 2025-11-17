"use client";

import { fetchEnrolled, getAllCourses, getAllPackages } from "@/lib/api";
import { useEffect, useState } from "react";
import { MainPageTour } from "./components/MainPage/MainPageTour";
import { useUserAuth } from "./context/user/UserAuthContext";
import { Course } from "./models/course";
import { CoursePackage } from "./models/course-package";
import { AllCoursesSection } from "./ui/components/AllCoursesSection";
import { HeroHome } from "./ui/components/Hero";
import { IntroScreen } from "./ui/components/IntroScreen/IntroScreen";
import { OnboardingScreen } from "./ui/components/OnboardingScreen/OnboardingScreen";
import { Robot } from "./ui/components/Robot";
import { TourModal } from "./ui/components/TourModal";

export default function Home() {
  const { user, loading: userLoading } = useUserAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursePackages, setCoursePackages] = useState<CoursePackage[]>([]);
  const [enrolled, setEnrolled] = useState<any[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [askTour, setAskTour] = useState(false);
  const [showTour, setShowTour] = useState<boolean>(false);

  useEffect(() => {
    setShowIntro(!localStorage.getItem("showedIntro"));
    setShowOnboarding(!localStorage.getItem("seenOnboarding"));
    setAskTour(!localStorage.getItem("askedTour"));
  }, []);

  useEffect(() => {
    Promise.all([getAllCourses(), fetchEnrolled(), getAllPackages()])
      .then(([coursesData, enrolledData, coursePackagesData]) => {
        setCourses(coursesData);

        setCoursePackages(coursePackagesData);

        if (enrolledData) {
          setEnrolled(enrolledData);
          setMyCourses(
            coursesData
              .filter(
                (c) =>
                  enrolledData.courses.find((e) => e.course.id === c.id) !==
                  undefined
              )
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
              )
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setLoadingError(true);
      });
  }, []);

  if (userLoading || loadingError) {
    return (
      <Robot
        loading={userLoading}
        text={
          loadingError
            ? "Leider können wir die Seite nicht darstellen."
            : undefined
        }
      />
    );
  }

  return (
    <>
      {user && showIntro ? (
        <IntroScreen
          onClose={() => {
            localStorage.setItem("showedIntro", "true");
            setShowIntro(false);
          }}
        />
      ) : user && showOnboarding ? (
        <OnboardingScreen
          onComplete={() => {
            localStorage.setItem("seenOnboarding", "true");
            setShowOnboarding(false);
            setAskTour(true);
          }}
        />
      ) : (
        <>
          {!loading && showTour && user && (
            <MainPageTour
              onComplete={() => {
                setShowTour(false);
              }}
            />
          )}

          <div className="mx-4 relative w-[98%] max-w-7xl mt-8 flex flex-col gap-10">
            {loading && <Robot />}

            {courses.length > 0 && (
              <>
                <AllCoursesSection
                  courses={courses}
                  enrolled={enrolled}
                  coursePackages={coursePackages}
                />
                <HeroHome lastCourse={myCourses[0] || courses[0]} />
              </>
            )}
          </div>
        </>
      )}
      {user && askTour && (
        <TourModal
          onAccept={() => {
            setShowTour(true);
            setAskTour(false);
            localStorage.setItem("askedTour", "true");
          }}
          onDecline={() => {
            setAskTour(false);
            localStorage.setItem("askedTour", "true");
          }}
        />
      )}
    </>
  );
}
