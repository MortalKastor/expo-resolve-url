package expo.modules.resolveurl

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import okhttp3.OkHttpClient
import okhttp3.Request

class ResolveUrlModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ResolveUrl")

    AsyncFunction("resolve") { url: String, promise: Promise ->
      val client = OkHttpClient.Builder()
        .followRedirects(false) // Critical: disable automatic redirect following
        .build()

      val request = Request.Builder()
        .url(url)
        .head() // Use HEAD to avoid downloading body content
        .build()

      try {
        val response = client.newCall(request).execute()
        
        when {
          response.isRedirect -> {
            response.header("Location")?.let { location ->
              promise.resolve(location)
            } ?: promise.reject("NO_LOCATION", "Redirect missing Location header", null)
          }
          else -> promise.reject("NO_REDIRECT", "Response code ${response.code} is not a redirect", null)
        }
        response?.close() // Prevent resource leaks
      } catch (e: Exception) {
        promise.reject("NETWORK_ERROR", e.localizedMessage, null)
      }
    }
  }
}
