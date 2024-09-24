const UserCheck = require("./UserCheck");
const UserQueries = require("./UserGet");
const UserGet = require("./UserQueries");
const UserUpdate = require("./UserUpdate");
const UserGet_Gender = require("./UserGet_Gender");
const UserMatch = require("./UserMatch");
const UserFame = require("./UserFame");
const UserBlock = require("./UserBlock");
const UserVisit = require("./UserVisit");
const UserMessage = require("./UserMessage");
const UserConnected = require("./UserConnected");
const UserNotification = require("./UserNotification");
module.exports = {
	...UserCheck, // Equivalent to { check_mail_user_exist, check_username_user_exist, check_verif_user, check_same_password }
	...UserQueries, // Equivalent to { getUserByEmail, getUserByUsername, get_profil_spec_by_id, get_profil_personal_by_id }
	...UserGet, // Equivalent to { createUser, insert_new_pictures, insert_location }
	...UserUpdate, // Equivalent to { update_user_spec, update_user_info, update_verification_status }
	...UserGet_Gender, // Equivalent to { getWomenProfiles, getMenProfiles, getBisexualProfiles, getOtherProfiles }
	...UserMatch, // Equivalent to { UserLikeProfiles, UserDislikeProfiles, checkMatch, GetAllProfilesLikes }
	...UserFame, // Equivalent to { getFame }
	...UserBlock, // Equivalent to { UserFakeProfile }
	...UserVisit, // Equivalent to { SetProfileVisited }
	...UserMessage, // Equivalent to { AddMessage }
	...UserConnected, // Equivalent to { updateConnectionStatus }
	...UserNotification, // Equivalent to { GetNotifications, AddNotification, DeleteNotification }
};
