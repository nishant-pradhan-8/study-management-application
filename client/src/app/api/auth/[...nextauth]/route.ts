import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { loginUser, registerUser } from "@/actions/users/usersAction";
const clientId:string | undefined = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const clientSecret:string | undefined = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;


const authOptions:NextAuthOptions ={
    session:{
        strategy:'jwt'
    },
    providers : [
      GoogleProvider({
        clientId:clientId!,
        clientSecret:clientSecret!
      })
      ],

    callbacks:{
        async signIn({token,account,user}){
            console.log('user', user)
            console.log('account',account)
            console.log("token",credentials)
            return true;
        },
        async session({ session }) {
          console.log('session',session)
          },
    }
} 
const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}