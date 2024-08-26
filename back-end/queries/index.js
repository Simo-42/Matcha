const UserCheck = require('./UserCheck');
const UserQueries = require('./UserGet');
const UserGet = require('./UserQueries');
const UserUpdate = require('./UserUpdate');

module.exports = {
	...UserCheck, // Equivalent to { check_mail_user_exist, check_username_user_exist, check_verif_user, check_same_password }
	...UserQueries, // Equivalent to { getUserByEmail, getUserByUsername, get_profil_spec_by_id, get_profil_personal_by_id }
	...UserGet, // Equivalent to { createUser, insert_new_pictures, insert_location }
	...UserUpdate // Equivalent to { update_user_spec, update_user_info, update_verification_status }
};