export const generateSlots = (
    startTime: string,
    endTime: string,
    slotDuration: number
) => {
    const slots: string[] = [];

    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    let start = startHour * 60 + startMin;
    const end = endHour * 60 + endMin;

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