The full quote & written specs can be viewed & commented on here:
https://docs.google.com/spreadsheet/ccc?key=0AoURnKZh8J-SdG8ySlB5bkhLdDMwOGFUVEFDbU1lUnc#gid=0

The invoice is located here:
http://prospect_recovery.meteor.com/prospect_recovery-faceyspacey-december-5-2013-invoice-320.html

The static sample site of what will be built and made to become dynamic can be viewed here:
http://prospect_recovery.meteor.com

The quote is accurate as of deployment to github and prospect_recovery.meteor.com at 9:25am on 12/6/13:
https://github.com/faceyspacey/prospect_recovery/blob/master/public/prospect_recovery-faceyspacey-december-5-2013-invoice-320.html


---------
BELOW ARE THE WRITTEN SPECS WHICH ARE ALSO IN THE ABOVE SPREADSHEET;
---------

DASHBOARD (month totals & daily line graph):
email deliveries
returns
recoveries
recovered % returned
returned % email delivered


MY CAMPAIGNS (grid page):
name
url
reply email
deliveries
recoveries


MY RECOVERIES (grid page): 
campaign name
first
last
email
city
state
date/time


REALTIME METRICS (realtime grid page - visitors grouped by step across all campaigns)
email
state
country
-additional steps: include in email cue, and step 2 return, and step 3 recovered


CREATE CAMPAIGN (form page):
name
url
from Address
from Name


EDIT CAMPAIGN (form page):
copy/paste javascript code field
javascript embed instructions
name
url
from Address
from Name


VIEW CAMPAIGN: (realtime grid page - visitors grouped by step)
email
state
country
-additional steps: include in email cue, and step 2 return, and step 3 recovered


MY ACCOUNT
email
password
password confirmation


HOMEPAGE
branded pitch page
signup/login buttons


SIGNUP/LOGIN


EMAIL DELIVERY
-algorithm: cue recovery emails for delivery based on time parameters set for campaign
-inject step 2 page with previously entered user info
-sent with appropriate from address and name, semi-automatically sync with volomp


IFRAME PIXEL
-dynamically inject cake marketing iframe pixel with corresponding campaign id and transaction id into thank you pages
-create a matching affiliate, campaign, transaction, etc, in Cake Marketing via the API


3RD PARTY SCRIPT	
-make a script that our customers can embed which tracks prospects, customers, bounces, conversions, returns, and sends customer info to our server.