import {
  addMonths,
  endOfWeek,
  getDaysInMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { ArrowLeft } from "./ArrowLeft";
import { ArrowRight } from "./ArrowRight";

interface WeekPickerProps {
  onChange?: (week: { firstDay: Date; lastDay: Date }) => void;
  startOfWeekDate?: Date;
  endOfWeekDate?: Date;
}

export const WeekPicker = ({
  onChange,
  startOfWeekDate,
  endOfWeekDate,
}: WeekPickerProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [week, setWeek] = useState({
    firstDay: startOfWeek(startOfWeekDate || new Date(), { weekStartsOn: 1 }),
    lastDay: endOfWeek(endOfWeekDate || new Date(), { weekStartsOn: 1 }),
  });

  useEffect(() => {
    onChange?.(week);
  }, [week]);

  const isLeapYear = () => {
    const leapYear = new Date(new Date().getFullYear(), 1, 29);
    return leapYear.getDate() == 29;
  };

  const convertDate = (date: Date) => {
    const dt = new Date(date);
    return `${dt.getDate()}.${dt.getMonth() + 1}.${dt.getFullYear()}.`;
  };

  const handleClick = (e: any) => {
    let localDate;

    if (e.target.id.includes("prev")) {
      localDate = new Date(date.setDate(1));
      setDate(new Date(date.setDate(1)));
    } else if (e.target.id.includes("next")) {
      localDate = new Date(date.setDate(getDaysInMonth(date)));
      setDate(new Date(date.setDate(getDaysInMonth(date))));
    } else {
      localDate = new Date(date.setDate(e.target.id));
      setDate(new Date(date.setDate(e.target.id)));
    }
    const firstDay = startOfWeek(localDate, { weekStartsOn: 1 });
    const lastDay = endOfWeek(localDate, { weekStartsOn: 1 });
    setWeek({ firstDay, lastDay });
  };

  const months = [
    "Jan.",
    "Feb.",
    "Mär.",
    "Apr.",
    "Mai",
    "Jun",
    "Jul",
    "Aug.",
    "Sep.",
    "Okt.",
    "Nov.",
    "Dez.",
  ];

  const days: { [key: string]: number } = {
    "1": 31,
    "2": isLeapYear() ? 29 : 28,
    "3": 31,
    "4": 30,
    "5": 31,
    "6": 30,
    "7": 31,
    "8": 31,
    "9": 30,
    "10": 31,
    "11": 30,
    "12": 31,
  };

  const renderDays = () => {
    const month = date.getMonth() + 1;
    const ar = [];
    for (let i = 1; i <= days[month]; i++) {
      const currentDate = new Date(date).setDate(i);

      let cName = "single-number ";
      if (
        new Date(week.firstDay).getTime() <= new Date(currentDate).getTime() &&
        new Date(currentDate).getTime() <= new Date(week.lastDay).getTime()
      ) {
        cName = cName + "selected-week";
      }

      ar.push(
        <div key={v4()} id={`${i}`} className={cName} onClick={handleClick}>
          {i}
        </div>
      );
    }

    const displayDate = new Date(date).setDate(1);
    let dayInTheWeek = new Date(displayDate).getDay();
    if (dayInTheWeek < 1) {
      dayInTheWeek = 7;
    }
    const prevMonth = [];
    let prevMonthDays = new Date(date).getMonth();

    if (prevMonthDays === 0) {
      prevMonthDays = 12;
    }

    for (let i = dayInTheWeek; i > 1; i--) {
      const thisDate = new Date(date);
      thisDate.setDate(1);
      const previousMonth = thisDate.setMonth(date.getMonth() - 1);

      const currentDate = new Date(previousMonth).setDate(
        days[prevMonthDays] - i + 2
      );

      let cName = "single-number other-month";
      const currentTime = new Date(currentDate).getTime();
      const firstTime = new Date(week.firstDay).getTime();
      const endTime = new Date(week.lastDay).getTime();

      if (currentTime >= firstTime && currentTime <= endTime) {
        cName = "single-number selected-week";
      }

      prevMonth.push(
        <div
          onClick={handleClick}
          key={v4()}
          id={"prev-" + i}
          className={cName}
        >
          {days[prevMonthDays] - i + 2}
        </div>
      );
    }

    const nextMonth = [];
    let fullDays = 35;

    if ([...prevMonth, ...ar].length > 35) {
      fullDays = 42;
    }

    for (let i = 1; i <= fullDays - [...prevMonth, ...ar].length; i++) {
      let cName = "single-number other-month";
      const lastDay = week.lastDay.getTime();
      const lastDayOfMonth = new Date(
        new Date(date).setDate(getDaysInMonth(date))
      );
      if (
        lastDayOfMonth.getTime() <= lastDay &&
        week.firstDay.getMonth() == lastDayOfMonth.getMonth() &&
        week.firstDay.getFullYear() == lastDayOfMonth.getFullYear()
      ) {
        cName = "single-number selected-week";
      }

      nextMonth.push(
        <div
          onClick={handleClick}
          key={v4()}
          id={"next-" + i}
          className={cName}
        >
          {i}
        </div>
      );
    }
    return [...prevMonth, ...ar, ...nextMonth];
  };

  const handleDate = (next = false) => {
    let localDate = new Date(date);
    if (next) {
      localDate = addMonths(localDate, 1);
    } else {
      localDate = subMonths(localDate, 1);
    }
    setDate(new Date(localDate));
  };

  return (
    <div
      className="week-picker-display"
      onBlur={() => setOpen(false)}
      onClick={() => setOpen(true)}
      tabIndex={0}
    >
      <p>
        {convertDate(week.firstDay)} - {convertDate(week.lastDay)}
      </p>
      {open && (
        <div className="week-picker-options">
          <div className="title-week">
            <div onClick={() => handleDate()} className="arrow-container">
              <ArrowLeft />
            </div>
            {`${months[date.getMonth()]} ${date.getFullYear()}`}
            <div onClick={() => handleDate(true)} className="arrow-container">
              <ArrowRight />
            </div>
          </div>
          <div className="numbers-container">
            <div className="single-number day">Mon</div>
            <div className="single-number day">Tue</div>
            <div className="single-number day">Wed</div>
            <div className="single-number day">Thu</div>
            <div className="single-number day">Fri</div>
            <div className="single-number day">Sat</div>
            <div className="single-number day">Sun</div>
          </div>
          <div className="numbers-container">{renderDays()}</div>
        </div>
      )}
    </div>
  );
};
