export default date => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "October", "Nov", "Dec"
    ];
    return `${monthNames[new Date(date).getMonth()]} ${new Date(date).getDate()}`;
}