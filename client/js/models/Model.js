Model = {
	errors: {},
	collection: function(){
		switch(this.collectionName) {
            	case 'Users':           return Meteor.users;
            	case 'Campaigns':          return Campaigns;
        }
    },
	save: function(attributes){
        if(this._id) this.collection().update(this._id, {$set: attributes});
        else {
            var insertValues = this.prepareDefaults(attributes);
			this._id = this.collection().insert(insertValues);
				
            if(this._id) this.afterInsert();
        }
        return this._id;
    },
    refresh: function(){
        this.extend(this.collection().findOne(this._id));
    },
	afterInsert: function() {
		
	},
	prepareDefaults: function(attributes){
		var object = {};
		_.extend(object, this.defaultValues, attributes); 
		return object;
    },
	getMongoValues: function() {
		var mongoValues = {};
		for(var prop in this) {
			if(!_.isFunction(this[prop])) mongoValues[prop] = this[prop];
		}
		delete mongoValues.errors;
		return mongoValues;
	},
	time: function(field) {
		return moment(this[field]).format("ddd, MMM Do, h:mm a");
	},
	extend: function(doc) {
		_.extend(this, doc);
	}
};