class CourseItem {
    courseName: string
    weekday: number
    weekIndexes: number[]
    teachers: string[]
    room: string
    endUnit: number
    startUnit: number

    constructor(courseName: string,
                weekday: number,
                weekIndexes: number[],
                teachers: string[],
                room: string,
                endUnit: number,
                startUnit: number) {
        this.courseName = courseName;
        this.weekday = weekday;
        this.weekIndexes = weekIndexes;
        this.teachers = teachers;
        this.room = room;
        this.endUnit = endUnit;
        this.startUnit = startUnit;
    }
}

export default CourseItem