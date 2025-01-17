export const getNextWeekDates = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + (7 - today.getDay()) + 1); // Next Monday
    
    const weekDates = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    days.forEach((day, index) => {
        const date = new Date(nextWeek);
        date.setDate(nextWeek.getDate() + index);
        weekDates[day] = date;
    });
    
    return weekDates;
};