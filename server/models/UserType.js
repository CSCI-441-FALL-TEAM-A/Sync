const { queryDB } = require('../db/database');

class UserType{
    static GROUPIE = 'Groupie';
    static MUSICIAN = 'Musician';
    static ADMIN = 'Admin';

    static TYPES = [
        UserType.GROUPIE,
        UserType.MUSICIAN,
        UserType.ADMIN,
    ]
}