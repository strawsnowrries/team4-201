package Chores;

import db.ChoreBase;
import db.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name= "AddChoreServlet", urlPatterns = {"/add-chore"})
public class AddChoreServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String d = request.getParameter("description");
        String r = request.getParameter("rotation_period");
        System.out.println(d);
        System.out.println(r);

        PrintWriter out = response.getWriter();

        long n = calculateMs(r);
        if(n == -1) {
            out.print("Invalid rotation period.");
            System.out.println("invalid rotation period");
        }
        else {
            System.out.println(n);
            User u = (User) request.getServletContext().getAttribute("user");
            ChoreManager cm = new ChoreManager(u);
            cm.addChore(d, n);
            out.print("added");
        }
    }

    private long calculateMs(String s) {
        String[] split = s.split("\\s+");
        if(split.length < 2) return -1;
        long n = 1;
        try {
            n = Long.parseLong(split[0]);
        } catch(NumberFormatException nfe) {
            return -1;
        }
        switch(split[1].toLowerCase()) {
            case "weeks":
            case "week":
            case "wks":
            case "wk":
            case "ws":
            case "w":
                n *= 7;
            case "days":
            case "day":
            case "dys":
            case "dy":
            case "ds":
            case "d":
                n *= 24;
            case "hours":
            case "hour":
            case "hrs":
            case "hr":
            case "hs":
            case "h":
                n *= 60;
            case "minutes":
            case "minute":
            case "mins":
            case "min":
            case "mns":
            case "mn":
            case "m":
                n *= 60;
            case "seconds":
            case "second":
            case "secs":
            case "sec":
            case "scs":
            case "sc":
            case "ss":
            case "s":
                n *= 1000;
            case "milliseconds":
            case "millisecond":
            case "millseconds":
            case "millsecond":
            case "milseconds":
            case "milsecond":
            case "mseconds":
            case "msecond":
            case "millisecs":
            case "millisec":
            case "millis":
            case "millsecs":
            case "millsec":
            case "mills":
            case "milsecs":
            case "milsec":
            case "mils":
            case "msecs":
            case "msec":
            case "ms":
            case "mls":
                break;
            default:
                return -1;
        }
        return n;
    }
}