@ECHO OFF
SETLOCAL
SET Configuration=%1
SET DIR=%~dp0
SET ProjectsFolder=%DIR%..\backend\Scoring\
SET OutputFolder=%DIR%..\pub\
IF "%Configuration%"=="" (SET Configuration=Release)

dotnet publish "%ProjectsFolder%IdentityServer" -c %Configuration% -f netcoreapp2.2 -o "%OutputFolder%IdentityServer"
dotnet publish "%ProjectsFolder%IntelART.OnlineLoans.BankRestApi" -c %Configuration% -f netcoreapp2.2 -o %OutputFolder%BankRestApi
dotnet publish "%ProjectsFolder%IntelART.OnlineLoans.LoanApplicationRestApi" -c %Configuration% -f netcoreapp2.2 -o "%OutputFolder%LoanRestApi"
dotnet publish "%ProjectsFolder%IntelART.OnlineLoans.CustomerRestApi" -c %Configuration% -f netcoreapp2.2 -o "%OutputFolder%CustomerRestApi"
dotnet publish "%ProjectsFolder%IntelART.OnlineLoans.CustomerModuleWebApp" -c %Configuration% -f netcoreapp2.2 -o "%OutputFolder%CustomerWebApp"
dotnet publish "%ProjectsFolder%IntelART.OnlineLoans.ShopModuleWebApp" -c %Configuration% -f netcoreapp2.2 -o %OutputFolder%ShopWebApp

ENDLOCAL