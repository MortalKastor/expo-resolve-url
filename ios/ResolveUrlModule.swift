import ExpoModulesCore
import Foundation

public class ResolveUrlModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ResolveUrl")

    AsyncFunction("resolve") { (url: String, promise: Promise) in
      guard let urlObj = URL(string: url) else {
        promise.reject("INVALID_URL", "Malformed URL string")
        return
      }

      let interceptor = RedirectInterceptor()

      interceptor.fetchLocation(from: urlObj) { location in
        if let location = location {
          promise.resolve(location)
        } else {
          promise.reject("NO_REDIRECT", "No Location header found")
        }
      }
    }
  }
}


class RedirectInterceptor: NSObject, URLSessionTaskDelegate {
  private var locationHeader: String?
  private var completion: ((String?) -> Void)?
  
  func fetchLocation(from url: URL, completion: @escaping (String?) -> Void) {
    self.completion = completion
    let session = URLSession(configuration: .default, delegate: self, delegateQueue: nil)
    var request = URLRequest(url: url)
    request.httpMethod = "HEAD"
    let task = session.dataTask(with: request) { _, _, error in
      if let error = error as? URLError, error.code == .cancelled {
        return // Ignore cancellation after intercepting redirect
      }
      completion(nil) // No redirect found
    }
    task.resume()
  }
  
  func urlSession(
    _ session: URLSession,
    task: URLSessionTask,
    willPerformHTTPRedirection response: HTTPURLResponse,
    newRequest request: URLRequest,
    completionHandler: @escaping (URLRequest?) -> Void
  ) {
    guard (300...399).contains(response.statusCode), let location = response.allHeaderFields["Location"] as? String else {
      completionHandler(request)
      return
    }
    
    completionHandler(nil) // Stop redirect
    task.cancel() // Cancel further processing
    locationHeader = location
    completion?(location)
  }
}
