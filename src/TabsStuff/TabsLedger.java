package TabsStuff;

import temp.tempUser;

import java.util.Vector;

public class TabsLedger {
	private Item itemBought;
	private tempUser purchaser;
	private Vector<tempUser> splitters;

	public TabsLedger(Item item, tempUser buy, Vector<tempUser> split){
		this.itemBought = item;
		this.purchaser = buy;
		this.splitters = split;
	}

	public Item getItemBought() {
		return itemBought;
	}

	public tempUser getPurchaser() {
		return purchaser;
	}

	public Vector<tempUser> getSplitters() {
		return splitters;
	}
}
