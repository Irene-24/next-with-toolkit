import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface User
{
    id: number,
    name: string,
    username: string,
    email: string,

}

export interface UsersState
{
    users: User[],
    status: 'idle' | 'pending' | 'rejected' | 'resolved';
    error: string;
    test?: string;
    love: number;
    poff: number;

}

const initialState: UsersState =
{
    users: [],
    status: "idle",
    error: "",
    test: "70",
    love: 1,
    poff: 100
};

export const getUsers = createAsyncThunk(
    'get_users',
    async ( _, { rejectWithValue } ) =>
    {
        try 
        {
            const resp = await fetch( "https://jsonplaceholder.typicode.com/users" );
            const data: User[] = await resp.json();

            return data;
        }
        catch ( error: any ) 
        {
            return rejectWithValue( error.message || "Error occurred" );
        }

    }
);

type AddUser = PayloadAction<Omit<User, "id">>;


export const usersSlice = createSlice(
    {
        name: "users",
        initialState,
        reducers:
        {
            addUser: ( state, action: AddUser ) =>
            {
                const id = new Date().getTime();
                const newUser = { ...action.payload, id };
                state.users.push( newUser );
            }
        },
        extraReducers: ( builder ) =>
        {
            builder
                .addCase( getUsers.pending, ( state ) =>
                {
                    state.status = "pending";
                    state.error = "";
                } )
                .addCase( getUsers.fulfilled, ( state, action ) =>
                {
                    state.status = "resolved";
                    state.users = [ ...action.payload, ...state.users ];
                    state.error = "";

                } )
                .addCase( getUsers.rejected, ( state, action ) =>
                {
                    state.status = "rejected";
                    state.error = action.payload as string;
                } );
        }
    }
);

export const { addUser } = usersSlice.actions;
export const selectUsers = ( state: RootState ) => state;


export default usersSlice.reducer;
