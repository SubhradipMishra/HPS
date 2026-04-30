export const generateSlots = (
    startTime: string,
    endTime: string,
    slotDuration: number
) => {
    const slots: string[] = [];

    const parseTime = (timeStr: string) => {
        const parts = timeStr.split(":");
        const hour = Number(parts[0]);
        const min = parts[1] ? Number(parts[1]) : 0;
        return hour * 60 + min;
    };

    let start = parseTime(startTime);
    const end = parseTime(endTime);


    while (start + slotDuration <= end) {
        const hour = Math.floor(start / 60);
        const minute = start % 60;

        const formattedTime = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;

        slots.push(formattedTime);
        start += slotDuration;
    }

    return slots;
};