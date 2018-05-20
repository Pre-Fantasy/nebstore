'use strict';

var AppItem = function(text) {
  if (text) {
    var o = JSON.parse(text);
    this.title = o.title;
    this.desc = o.desc;
    this.website = o.website;
    this.thumbUrl = o.thumbUrl;
    this.author = o.author;
    this.contract = o.contract;
    this.address = o.address;
    this.id = o.id;
    this.totalRewards = new BigNumber(o.totalRewards);
  } else {
    this.title = '';
    this.desc = '';
    this.website = '';
    this.thumbUrl = '';
    this.author = '';
    this.contract = '';
    this.address = '';
    this.id= 0;
    this.totalRewards = new BigNumber(0);
  }
}

AppItem.prototype = {
  toString: function() {
    return JSON.stringify(this);
  }
}
var StoreContract = function() {
  LocalContractStorage.defineProperty(this, "size");
  LocalContractStorage.defineProperty(this, "owner");
  LocalContractStorage.defineMapProperty(this, "apps", {
    parse: function(text) {
      return new AppItem(text);
    },
    stringify: function(o) {
      return o.toString();
    }
  });
}
StoreContract.prototype = {
  init: function() {
    this.size = 0;
    this.owner = Blockchain.transaction.from;
  },
  add: function(title, desc, website, thumbUrl, author, contract) {
    if (title === "" || desc === "" || website === "" || thumbUrl === "" || author === "" || contract === "") {
      throw new Error("params should not be empty!");
    }
    var id = this.size;
    var from = Blockchain.transaction.from;

    var item = new AppItem();
    item.title = title;
    item.desc = desc;
    item.website = website;
    item.thumbUrl = thumbUrl;
    item.author = author;
    item.contract = contract;
    item.address = from;
    item.id = id;
    item.totalRewards = 0;

    this.apps.put(id, item);
    this.size += 1;
  },
  owner: function() {
    return this.owner;
  },
  len: function() {
    return this.size;
  },
  ownerAddr: function() {
    return this.owner;
  },
  fetchAppList: function() {
    var result = [];
    for (var i = 0; i < this.size; i++) {
      result[i] = this.apps.get(i);
    }
    return result;
  },
  _transfer: function(address, value) {
    var result = Blockchain.transfer(address, value);
    if (!result) {
      throw new Error("transfer failed.");
    }
    Event.Trigger("transfer", {
			Transfer: {
				from: Blockchain.transaction.to,
				to: address,
				value: value
			}
		});
  },
  reward: function(id) {
    var from = Blockchain.transaction.from;
    var to = Blockchain.transaction.to;
    var value = Blockchain.transaction.value;
    value = new BigNumber(value);
    if (value < new BigNumber(10**15)) {
      throw new Error("reward too small");
    }
    var item = this.apps.get(id)
    if (!item) {
      throw new Error("dapp id not exist");
    }
    var address = item.address
    var toOwner = value.div(10);
    var toAuthor = value.minus(toOwner);
    this._transfer(this.owner, toOwner);
    this._transfer(address, toAuthor);
    var oldValue = item.totalRewards;
    item.totalRewards = oldValue.plus(toAuthor);
    this.apps.put(id, item);
  },
  verifyAddress: function(address) {
    var result = Blockchain.verifyAddress(address);
    console.log("verifyAddress result:", result);
  }
}

module.exports = StoreContract;
