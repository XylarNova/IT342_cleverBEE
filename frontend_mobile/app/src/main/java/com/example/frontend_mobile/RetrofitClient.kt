import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import com.example.frontend_mobile.ApiService


object RetrofitClient {
    private const val BASE_URL = "http://192.168.254.103:8080"// use emulator loopback

    val instance: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}
