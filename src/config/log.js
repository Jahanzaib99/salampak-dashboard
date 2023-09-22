/*
* Development only console.log function
*/
const log = (status, color, msg) => {
    if (process.env.NODE_ENV === "development") {
        var css = "",
            paint = { // default colors
                clr: "#212121",
                bgc: "#b0bec5"
            },
            colors = {
                error: { clr: "#ffebee", bgc: "#c62828" }, // red
                success: { clr: "#e8f5e9", bgc: "#2e7d32" }, // green
                warning: { clr: "#fff3e0", bgc: "#f4511e" }, // orange
                info: { clr: "#ede7f6", bgc: "#651fff" } // purple
            };

        // overriting default colors if color given
        if (colors.hasOwnProperty(color)) { paint.clr = colors[color].clr; paint.bgc = colors[color].bgc; }
        css = "color:" + paint.clr + ";font-weight:bold; background-color: " + paint.bgc + "; padding: 3px;";

        // console.log("%c" + status, css, msg);
    }
}
export default log;