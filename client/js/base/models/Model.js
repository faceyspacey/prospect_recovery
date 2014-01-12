Model = {
	errors: {},
	collection: function(){
		switch(this.collectionName) {
            	case 'Users':           return Meteor.users;
            	case 'Campaigns':       return Campaigns;
				case 'LimelightCampaigns':       return LimelightCampaigns;
				case 'Prospects':           return Prospects;
				case 'Delays': 			return Delays;
        }
    },
	db: function() {
		if(this._local) return this.collection()._collection;
		else return this.collection();
	},
	store: function() {
		this.prepareForServerStorage();
		return this.save();
	},
	prepareForServerStorage: function() {
		this._local = false;
		this._id = null;
	},
	save: function(){
		var attributes = this.getMongoAttributes();
		return this.upsert(attributes);	
    },
	upsert: function(attributes) {
		if(this._id) return this.update(attributes);
		else return this.insert(attributes);
	},
	insert: function(attributes) {
		attributes = this.prepareDefaults(attributes);
		this._id = this.db().insert(attributes);
		
		if(this._id) this.afterInsert();
		else return false;
		
		return this._id;
	},
	update: function(attributes) {
		this.db().update(this._id, {$set: attributes});
		this.refresh();
		return this._id;
	},
    refresh: function(){
        this.extend(this.collection().findOne(this._id));
    },
	afterInsert: function() {},
	prepareDefaults: function(attributes){
		var object = {};
		_.extend(object, this.defaultValues, attributes); 
		return object;
    },
	getMongoAttributes: function(includeId) {
		var mongoValues = {};
		for(var prop in this) {
			if(this.isMongoAttribute(prop)) mongoValues[prop] = this[prop];
		}
		
		if(includeId) mongoValues._id = this[_id];
		
		return mongoValues;
	},
	isMongoAttribute: function(prop) {
		if(_.isFunction(this[prop])) return false;
		if(prop == '_id' || prop == 'errors' || prop == '_local') return false;
		return true;
	},
	time: function(field) {
		return moment(this[field]).format("MM/DD - h:mma");
	},
	extend: function(doc) {
		doc = doc != undefined && _.isObject(doc) ? doc : {};
		
		_.extend(this, doc);
	}
};