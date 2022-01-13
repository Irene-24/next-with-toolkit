import React from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../app/hooks';

import { selectUsers, getUsers, User } from '../features/users/usersSlice';

const Users = () =>
{
    const { users: { users, error, status } } = useAppSelector( selectUsers );
    const dispatch = useAppDispatch();

    const fetchUsers = () =>
    {
        return dispatch( getUsers() );
    };

    const fetchUsersB = () =>
    {
        fetchUsers()
            .unwrap()
            .then( () =>
            {
                alert( "success" );
            } )
            .catch( ( rejectedValueOrSerializedError: string ) =>
            {
                alert( rejectedValueOrSerializedError || "error" );
            } );
    };

    return (
        <>
            <button
                onClick={ fetchUsersB }
            >Get users</button>

            <Link href="/add-user">
                <a>
                    Add user
                </a>
            </Link>

            {
                status === "pending" ? <h3>Loading</h3> : null
            }

            {
                status === "rejected" ? <h3>{ error }</h3> : null
            }

            <ul>
                {
                    users.map( ( user: User ) => (
                        <li key={ user.id }>
                            <h3>{ user.name }</h3>
                            <p>{ user.username }</p>
                            <p> <i>{ user.email }</i> </p>
                        </li>
                    ) )
                }
            </ul>
        </>
    );
};

export default Users;
