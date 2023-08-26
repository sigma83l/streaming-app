import * as bcrypt from 'bcrypt';

export class Hash {
    static async hash(code: string): Promise<string>{
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(code, salt);

            return hash;
        } catch (err) {
            console.log(err);
        }
    }
    static async compare(password: string, hash: string){
     const isMatch = await bcrypt.compare(password, hash);
     return isMatch;       
    }
}