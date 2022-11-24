import {createClient, SupabaseClient} from "@supabase/supabase-js";

class Supabase {
  private static instance: Supabase;
  private readonly supabaseClient: SupabaseClient;

  private constructor() {
    if (!process.env.SUPABASE_URL) throw 'Supabase URL shouldnt be empty'
    if (!process.env.SUPABASE_KEY) throw 'Supabase KEY shouldnt be empty'
    this.supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  }

  public static getInstance(): Supabase {
    if (!Supabase.instance) {
      Supabase.instance = new Supabase();
    }

    return Supabase.instance;
  }

  public getSupabase() {
    return this.supabaseClient
  }
}

export default () => Supabase.getInstance().getSupabase()
