import React, { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch } from '../app/hooks';

import { addUser } from "../features/users/usersSlice";


const AddUser = () =>
{

    const dispatch = useAppDispatch();

    const [ state, setstate ] = useState(
        {
            name: "",
            username: "",
            email: "",
        }
    );
    const handleSubmit = ( event: FormEvent ) =>
    {
        event.preventDefault();
        dispatch( addUser( state ) );
    };

    const handleChange = ( ev: ChangeEvent<HTMLInputElement> ) =>
    {
        const { value, id } = ev.target;

        setstate(
            {
                ...state,
                [ id ]: value
            }
        );

    };

    return (
        <>
            <Link href="/users">
                <a>
                    All users
                </a>
            </Link>

            <form onSubmit={ handleSubmit }>

                <fieldset>
                    <legend>User form</legend>
                    <div>
                        <label htmlFor="name">
                            Name
                        </label>

                        <input
                            onChange={ handleChange }
                            type="text" id="name" name="name" />
                    </div>

                    <div>
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            onChange={ handleChange }
                            type="email" id="email" name="email" />
                    </div>

                    <div>
                        <label
                            htmlFor="username">
                            Username
                        </label>

                        <input
                            onChange={ handleChange }
                            type="text" id="username" name="username" />
                    </div>
                </fieldset>

                <button type="submit">Submit</button>

            </form>
        </>

    );
};

export default AddUser;
