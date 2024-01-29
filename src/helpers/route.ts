export async function GET(){
    const res = process.env.KEYPAIR;
    const auth_keypair = JSON.parse(res!);

    return Response.json({auth_keypair})
}