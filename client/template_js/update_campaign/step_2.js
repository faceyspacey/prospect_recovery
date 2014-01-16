Template.step_2.created = function() {
	Meteor.user().updateLimelightCampaigns();
	Deps.afterFlush(function() {
		Meteor.setTimeout(function() {
			Template.step_2.is_created = true;
			$('#campaign_step_2').animate({left: '0%'}, 800, 'easeOutBack');
		}, 100);
	});
};

Template.step_2.destroyed = function() {
	Template.step_2.is_created = false;
};

Template.step_2.rendered = function() {
	if(Template.step_2.is_created) $('#campaign_step_2').css({left: '0%'});
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
			currentCampaignId = CampaignModel.current()._id
			oldDestinationCampaign = LimelightCampaigns.findOne({destination_campaign_id: currentCampaignId}),
			oldDestinationId = oldDestinationCampaign ? oldDestinationCampaign._id : null;
			
		console.log(oldDestinationId, oldDestinationCampaign);
		
		if(oldDestinationId) LimelightCampaigns.update(oldDestinationId, {$set: {destination_campaign_id: null}});
		
		this.destination_campaign_id = currentCampaignId;
		this.save();
		
		currentCampaign.limelight_destination_campaign_id = this._id;
		currentCampaign.save();
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
			Deps.afterFlush(function() {
				Meteor.setTimeout(function() {
					$('html,body').animate({scrollTop: 0}, 600, 'easeOutExpo');
				}, 800);
			});
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