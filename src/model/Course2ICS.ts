import CourseItem from "@/model/CourseItem";
import {getGap, getIndexes} from "@/utils/classifier";
import moment, {Moment} from "moment";

class Course2ICS {

    private static readonly CLASS_TIME = [
        "080000", "085000", "100500", "105500", "140000",
        "145000", "155500", "164500", "190000", "195000"
    ]

    private static readonly QUIT_TIME = [
        "084500", "093500", "105000", "114000", "144500",
        "153500", "164000", "173000", "194500", "203500"
    ]

    private static readonly WEEK_DAY = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]

    private static readonly ICS_START = 'BEGIN:VCALENDAR\n' +
        'VERSION:2.0 \n' +
        'PRODID:yuanczx\n' +
        'BEGIN:VTIMEZONE\n' +
        'TZID:Asia/Shanghai\n' +
        'TZURL:http://tzurl.org/zoneinfo-outlook/Asia/Shanghai\n' +
        'X-LIC-LOCATION:Asia/Shanghai\n' +
        'BEGIN:STANDARD\n' +
        'TZNAME:CST\n' +
        'TZOFFSETFROM:+0800\n' +
        'TZOFFSETTO:+0800\n' +
        'DTSTART:19700101T000000\n' +
        'END:STANDARD\n' +
        'END:VTIMEZONE\n'

    private static ICS_END = 'END:VCALENDAR' //ics结束语句

    private readonly startDate: Moment

    private readonly courses: CourseItem[]
    private icsText = ''


    constructor(courses: CourseItem[], startDate: Moment) {
        this.courses = courses
        this.startDate = startDate
    }

    public makeEvents(): string {
        this.icsText += Course2ICS.ICS_START
        for (const courseItem of this.courses) {
            const gap = getGap(courseItem.weekIndexes)
            const indexes = getIndexes(gap)
            // console.log(courseItem.weekIndexes.length)
            // console.log(gap)
            // console.log(indexes)
            for (let i = 0; i < indexes.length; i++) {
                const copyStartDate = moment(this.startDate)
                const date = copyStartDate.add((courseItem.weekIndexes[indexes[i]] - 1), 'week')
                    .add(courseItem.weekday - 1, 'day')
                    .format('YYYYMMDD')
                let interval = 1, count = 1
                if (indexes[i] != courseItem.weekIndexes.length - 1) {
                    interval = gap[indexes[i] + 1]
                }
                if (i == indexes.length - 1) {
                    count = courseItem.weekIndexes.length - indexes[i]
                } else {
                    count = indexes[i + 1] - indexes[i]
                }
                const uuid = this.getUuid()
                this.icsText += 'BEGIN:VEVENT\nUID:' + uuid + '\nDTSTART;TZID=Asia/Shanghai:' +
                    date + 'T' + Course2ICS.CLASS_TIME[courseItem.startUnit - 1] + '\n' +
                    'RRULE:FREQ=WEEKLY;INTERVAL=' + interval + ';BYDAY=' + Course2ICS.WEEK_DAY[courseItem.weekday - 1] +
                    ';COUNT=' + count + '\n' +
                    'DTEND;TZID=Asia/Shanghai:' + date + 'T' + Course2ICS.QUIT_TIME[courseItem.endUnit - 1] + '\n' +
                    'SUMMARY:' + courseItem.courseName + '\n' +
                    'DESCRIPTION:' + courseItem.teachers[0] + '\n' +
                    'LOCATION:' + courseItem.room + '\n' +
                    'END:VEVENT' + '\n'
            }
        }
        this.icsText += Course2ICS.ICS_END
        return this.icsText
    }

    public clearIcs() {
        this.icsText = ''
    }


    //生成UUID
    public getUuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }


}

export default Course2ICS