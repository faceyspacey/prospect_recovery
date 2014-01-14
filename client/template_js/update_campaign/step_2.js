Template.step_2.created = function() {
	Meteor.user().updateLimelightCampaigns();
	Deps.afterFlush(function() {
		$('#campaign_step_2').animate({left: '0%'}, 800, 'easeOutBack');
	});
};

Template.step_2.rendered = function() {
	console.log('step 2 rendered');
		$('#campaign_step_2').css({left: '0%'});
}

Template.step_2.helpers({
	displayCheckbox: function() {
		return !this.isRecipientCampaign() || this.recipient_campaign_id == CampaignModel.current()._id;
	},
	isChecked: function() {
		return this.isCurrentRecipientCampaign(CampaignModel.current()) ? 'checked=:"checked"' : '';
	},
	displayRadioButton: function() {
		return !this.isDestinationCampaign() || this._id == CampaignModel.current().limelight_destination_campaign_id;
	}
});

Template.step_2.events({
	'click .select_destination_campaign': function() {
		var currentCampaign = CampaignModel.current(),
			currentCampaignId = CampaignModel.current()._id;
			
		currentCampaign.limelight_destination_campaign_id = this._id;
		currentCampaign.save();
		
		//remove old limelight campaign who the current campaign as destination
		LimelightCampaigns.update({destination_campaign_id: currentCampaignId}, {$set: {destination_campaign_id: undefined}}, {multi: true});
		
		this.destination_campaign_id = currentCampaignId;
		this.save();
	},
	'click #check_all': function(e) {
		if($('#check_all').is(':checked')) $('input[type=checkbox]').prop('checked', true); 
		else $('input[type=checkbox]').prop('checked', false);
	},
	'click #refresh_list': function() {
		Meteor.user().updateLimelightCampaigns();
	},
	'click .next-step': function() {
		var ids = [];
		$('input[type=checkbox]:checked').each(function() {
			var limelightCampaignId = $(this).attr('id');
			ids.push(limelightCampaignId);
		});
		
		Meteor.call('setRecipientLimelightCampaigns', ids, CampaignModel.current()._id);		
		
		$('#campaign_step_2').animate({left: '-100%', opacity: 0}, 600, 'easeInBack', function() {
			Router.go('update_campaign_step_3', {id: CampaignModel.current()._id});
		});
	}
});

$(function() {
	$('.select_destination_campaign').live('mouseenter', function() {
		$(this).css('background', '#2ACAAB');
	}).live('mouseleave', function() {
		$(this).css('background', '#16a085');
	});
})