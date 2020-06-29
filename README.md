# Page Mapping With SignalR Example

 This project is a brief example of what you can do by using the SignalR along with the Visibility API and Blur/Focus events of the browsers to track any user through your web-application.
 
 More information about: Microsoft SignalR Map Controller with Page Visibility API and Event Blur to Mapping the User Interaction in a Document Management System (DMS) on [CodeProject](https://www.codeproject.com/Articles/5271889/Microsoft-SignalR-Map-Controller-with-Page-Visibil) or [ResearchGate](https://www.researchgate.net/publication/342425349_Microsoft_SignalR_Map_Controller_with_Page_Visibility_API_and_Event_Blur_to_Mapping_the_User_Interaction_in_a_Document_Management_System_DMS).

## Building with Visual Studio 2019 on Windows (Requires [.NET Core 3.1 SDK or later](https://dotnet.microsoft.com/download/dotnet-core/3.1))
 - Open the solution with VS 2019
 - Deploy (CTRL + F5)
 - Open [https://localhost:44360/](https://localhost:44360/) or http://localhost:3873

## Building without Visual Studio 2019 (Also requires [.NET Core 3.1 SDK or later](https://dotnet.microsoft.com/download/dotnet-core/3.1))
 - Navigate into the project's folder
 - `dotnet  watch  run`
  - Open [https://localhost:44360/](https://localhost:44360/) or http://localhost:3873

For linux users: some of you will need to force the HTTPs to deploy the first time, here follows the [link](https://docs.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-3.1&tabs=visual-studio#trust-the-aspnet-core-https-development-certificate-on-windows-and-macos) on how to do it.
