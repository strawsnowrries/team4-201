package TabsServlet;

import Methods.Magic;
import TabsStuff.GroceryItem;
import com.google.gson.Gson;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Vector;

@WebServlet (name= "GroceryList", urlPatterns = {"/GroceryList"})
public class GroceryList extends HttpServlet {

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			IOException {

		response.setContentType("application/json;charset=UTF-8");

		Magic magic = new Magic();

		//For testing
		request.setAttribute("room", "5566");
		magic.addGrocery("Beef", 5566);
		//TODO: remove this

		String room = (String) request.getAttribute("room");
		int roomID = Integer.parseInt(room);

		Vector<GroceryItem> groceryList = magic.getGroceryList(roomID);
		Gson gson = new Gson();
		String output = gson.toJson(groceryList);
		System.out.println(output);

		PrintWriter out = response.getWriter();
		out.print(output);
	}

}