module.exports={
    timespan: function (date1, date2) {
        if (date1 > date2) { // swap
            var result = (date2, date1);
            result.years  = -result.years;
            result.months = -result.months;
            result.days   = -result.days;
            result.hours  = -result.hours;
            return result;
        }
        result = {
            years:  date2.getYear()  - date1.getYear(),
            months: date2.getMonth() - date1.getMonth(),
            days:   date2.getDate()  - date1.getDate(),
            hours:  date2.getHours() - date1.getHours()
        };
        if (result.hours < 0) {
            result.days--;
            result.hours += 24;
        }
        if (result.days < 0) {
            result.months--;
            // days = days left in date1's month,
            //   plus days that have passed in date2's month
            var copy1 = new Date(date1.getTime());
            copy1.setDate(32);
            result.days = 32-date1.getDate()-copy1.getDate()+date2.getDate();
        }
        if (result.months < 0) {
            result.years--;
            result.months+=12;
        }
        if(result.years === 'NaN'){
            result.years=0
        }
        return result;
    }
}
