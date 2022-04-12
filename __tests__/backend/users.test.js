import React from 'react';
import { getDatabase, ref, push, get, remove } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../../firebase';

describe('User table tests', () => {

    beforeEach(() => {
        db = getDatabase();
    });

    it('Insert into User table', () => {
        const testEmail = 'jesttestEmail@email.com'
        const usersRef = ref(db, 'users/');
        const key = push(usersRef, {
            email: testEmail,
            firstName: 'firsttest',
            lastName: 'lasttest',
            password: 'testjestpass',
        }).key;
        const emailRef = ref(db, `users/${key}/email`);
        get(emailRef, (snapshot) => {
            const data = snapshot.val();
            console.log("DATA: " + data);
            expect(data).toBe(testEmail);
        });
        const userDeleteRef = ref(db, `users/${key}`);
        remove(userDeleteRef);
    });
});