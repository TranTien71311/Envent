using iAnywhere.Data.SQLAnywhere;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Reflection;
using System.Runtime.Serialization.Formatters.Binary;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using IWshRuntimeLibrary;

using System.Security.Claims;
using Org.BouncyCastle.OpenSsl;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Security;
using System.Web.Configuration;
using System.Web.Hosting;
using Newtonsoft.Json.Linq;
using SpeedCoreWeb.Frameworks;
using File = System.IO.File;

namespace SpeedCoreWeb.Codes
{
    public static class FunctionHelper
    {
        public static string GenerateRandomOTP(string[] AllowedCharacters, int iOTPLength)
        {
            string sOTP = String.Empty;
            string sTempChars = String.Empty;
            Random rand = new Random();
            for (int i = 0; i < iOTPLength; i++)
            {
                int p = rand.Next(0, AllowedCharacters.Length);
                sTempChars = AllowedCharacters[rand.Next(0, AllowedCharacters.Length)];
                sOTP += sTempChars;
            }
            return sOTP;
        }

        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = Encoding.UTF8.GetBytes(plainText);
            return Convert.ToBase64String(plainTextBytes);
        }

        private static List<T> ConvertDataTable<T>(DataTable dt)
        {
            return JsonConvert.DeserializeObject<dynamic>(JsonConvert.SerializeObject(dt));
        }

        /// <summary>
        /// Write a file to Logs/ folder. If file does not exits, create it
        /// </summary>
        /// <param name="folderName"></param>
        /// <param name="fileName"></param>
        /// <param name="logText"></param>
        /// <param name="isAppend">If set to true => Append logText to file instead of override it. Default value is False</param>
        public static void WriteLog(string folderName, string fileName, string logText, bool isAppend = false)
        {
            try
            {
                var folderPath = GetLogsFolderPath(folderName);
                if (folderPath != null && !Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var fileNameOfDefault = fileName ?? $"{DateTime.Now:yyyy-MM-dd-HHmmssfff}_{new Random().Next(1, 10000)}.log";
                var filePath = $"{folderPath}{Path.DirectorySeparatorChar}{fileNameOfDefault}";
                
                // https://stackoverflow.com/a/2837043
                if(isAppend) File.AppendAllText(filePath, logText);
                else File.WriteAllText(filePath, logText);
            }
            catch (Exception ex)
            {
                var mode = isAppend ? "append" : "write";
                Console.WriteLine($"Error while {mode} log to file. {ex.Message}");
            }
        }
        
        /// <summary>
        /// Read a file from Logs/ folder. If file dose not exist, return empty string ""
        /// </summary>
        /// <param name="folderName"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public static string ReadLog(string folderName, string fileName)
        {
            try
            {
                var folderPath = GetLogsFolderPath(folderName);
                var filePath = $"{folderPath}{Path.DirectorySeparatorChar}{fileName}";
                return File.ReadAllText(filePath);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while read log file. {ex.Message}");
                return "";
            }
        }
        
        public static string GetLogsFolderPath(string folderName = "")
        {
            return System.Web.Hosting.HostingEnvironment.MapPath("~/Logs/" + folderName);
        }

        public static void WriteLog(string LogType, string LogText)
        {
            try
            {
                string LogPath = HostingEnvironment.MapPath("~/Logs/" + LogType);
                if (!Directory.Exists(LogPath))
                    Directory.CreateDirectory(LogPath);
                StreamWriter sw = new StreamWriter(LogPath + "/" + DateTime.Now.ToString("yyyyMMddHHmmssfff") + (new Random()).Next(1, 10000) + ".log");
                sw.Write(LogText);
                sw.Close();
            }
            catch (Exception)
            {

            }
        }
        
        /// <summary>
        /// Refs: https://stackoverflow.com/a/4272601
        /// </summary>
        /// <param name="x"></param>
        /// <returns></returns>
        public static string GetAllFootprints(Exception exception)
        {
            var stringBuilder = new StringBuilder();

            while (exception != null)
            {
                stringBuilder.AppendLine(exception.Message);
                stringBuilder.AppendLine(exception.StackTrace);

                exception = exception.InnerException;
            }

            return stringBuilder.ToString();
        }
        
        public static string getBetween(string strSource, string strStart, string strEnd)
        {
            int Start, End;
            if (strSource.Contains(strStart) && strSource.Contains(strEnd))
            {
                Start = strSource.IndexOf(strStart, 0) + strStart.Length;
                End = strSource.IndexOf(strEnd, Start);
                return strSource.Substring(Start, End - Start);
            }
            else
            {
                return "";
            }
        }

        public static string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = Convert.FromBase64String(base64EncodedData);
            return Encoding.UTF8.GetString(base64EncodedBytes);
        }

        public static string RSAEncryption(string strText)
        {
            var publicKey = "<RSAKeyValue><Modulus>cqndQeH+clUoOn+cKRB3K/sRtX6TOfqu2vjeLSPSc+SzpI52yOA4BedE7dp2tlA9A46pi0WP18HOCAoZXy4qHA2ri7DOnsKX8Mg1Vr2KPAMl3YFWqhk/S99+4a/dpKDwrnRNi5kv0i2mllN5x5ZcZ9E7Y1e8nm9FGdIJCxA+XiM=</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>";
            var testData = Encoding.UTF8.GetBytes(strText);
            using (var rsa = new RSACryptoServiceProvider(1024))
            {
                try
                {
                    rsa.FromXmlString(publicKey.ToString());
                    var encryptedData = rsa.Encrypt(testData, true);
                    var base64Encrypted = Convert.ToBase64String(encryptedData);
                    return base64Encrypted;
                }
                finally
                {
                    rsa.PersistKeyInCsp = false;
                }
            }
        }

        public static string RSADecryption(string strText)
        {
            var privateKey = "<RSAKeyValue><Modulus>cqndQeH+clUoOn+cKRB3K/sRtX6TOfqu2vjeLSPSc+SzpI52yOA4BedE7dp2tlA9A46pi0WP18HOCAoZXy4qHA2ri7DOnsKX8Mg1Vr2KPAMl3YFWqhk/S99+4a/dpKDwrnRNi5kv0i2mllN5x5ZcZ9E7Y1e8nm9FGdIJCxA+XiM=</Modulus><Exponent>AQAB</Exponent><P>zuYlR922YFu/MakBNDKCHn83FkYMQCaFvcDoUX4TZ4R2Qjg+acUjXzScV41Ul/mWedBwlXcGQ/epoB4OsOQkxQ==</P><Q>jeAVdokpxC+pKhKTAGFEXq7Z4Sji6UUrhf3ARcfa4v7hQEMqTlcui7jp9/kCz25feCpmzCPjg1E26mkWRLU1xw==</Q><DP>YHvO8t6fx/vBA4WOvCq5p0MoC0kLOXc9cyncrPQgVGvfQi48XNLEFgfQyLttsZmA5LmhZvIkh9mczsB1lWQvCQ==</DP><DQ>RP81cPBD36VOH6fo1cZ3+ZQPYfEAaXG6OO+vEkCfssVBxn7jlDXR7SGAp5fyRe7nfwkf9Sd+/d4BVv7EVaXLAQ==</DQ><InverseQ>grNU3qASSC4QYF7X6BB+lxIP3rHbaN0zSeTJtt0jJMNHA48PDv6FrGMj6KPWK0pDDPxKrTdEXD5JixSc8iR+gg==</InverseQ><D>B6P4AV7cxKOWBafhMP9O4ZheSri/eLqSkjbJHzrm2CAiNFHl6ma+dO4/MpY/GNDp7+W+uHAPMLJSV0jM/gGmfpbRAP7WGOaRMToBNwxHV/dwVqnNzjAS6pd8TJGt8lF6AbQla3uSABbyG/YXb59BXKEivPDOuCoFbY+tQTb/Tek=</D></RSAKeyValue>";
            var testData = Encoding.UTF8.GetBytes(strText);
            using (var rsa = new RSACryptoServiceProvider(1024))
            {
                try
                {
                    var base64Encrypted = strText;
                    rsa.FromXmlString(privateKey);
                    var resultBytes = Convert.FromBase64String(base64Encrypted);
                    var decryptedBytes = rsa.Decrypt(resultBytes, true);
                    var decryptedData = Encoding.UTF8.GetString(decryptedBytes);
                    return decryptedData.ToString();
                }
                finally
                {
                    rsa.PersistKeyInCsp = false;
                }
            }
        }

        public static bool VerifyMessage(string originalMessage, string signedMessage)
        {
            bool verified;
            try
            {
                var publicKey = "<RSAKeyValue><Modulus>cqndQeH+clUoOn+cKRB3K/sRtX6TOfqu2vjeLSPSc+SzpI52yOA4BedE7dp2tlA9A46pi0WP18HOCAoZXy4qHA2ri7DOnsKX8Mg1Vr2KPAMl3YFWqhk/S99+4a/dpKDwrnRNi5kv0i2mllN5x5ZcZ9E7Y1e8nm9FGdIJCxA+XiM=</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>";
                RSACryptoServiceProvider rsa = new RSACryptoServiceProvider(1024);
                rsa.FromXmlString(publicKey);
                verified = rsa.VerifyData(Encoding.UTF8.GetBytes(originalMessage), CryptoConfig.MapNameToOID("SHA1"), Convert.FromBase64String(signedMessage));
            }
            catch (Exception)
            {
                verified = false;
            }

            return verified;
        }

        public static string ObjectToJsonString(object obj)
        {
            string JSONString = string.Empty;
            JSONString = JsonConvert.SerializeObject(obj);
            return JSONString;
        }
        
        /// <summary>
        /// Clone an object using Deep Cloning technique.
        /// Useful for converting an anonymous type object to a class Object.
        /// Ref: https://stackoverflow.com/a/28222333
        /// </summary>
        /// <param name="inputObject"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T DeepCloneObject<T>(object inputObject)
        {
            return JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(inputObject));
        }

        public static string SignMessage(string message)
        {
            string signedMessage;
            try
            {
                var privateKey = "<RSAKeyValue><Modulus>cqndQeH+clUoOn+cKRB3K/sRtX6TOfqu2vjeLSPSc+SzpI52yOA4BedE7dp2tlA9A46pi0WP18HOCAoZXy4qHA2ri7DOnsKX8Mg1Vr2KPAMl3YFWqhk/S99+4a/dpKDwrnRNi5kv0i2mllN5x5ZcZ9E7Y1e8nm9FGdIJCxA+XiM=</Modulus><Exponent>AQAB</Exponent><P>zuYlR922YFu/MakBNDKCHn83FkYMQCaFvcDoUX4TZ4R2Qjg+acUjXzScV41Ul/mWedBwlXcGQ/epoB4OsOQkxQ==</P><Q>jeAVdokpxC+pKhKTAGFEXq7Z4Sji6UUrhf3ARcfa4v7hQEMqTlcui7jp9/kCz25feCpmzCPjg1E26mkWRLU1xw==</Q><DP>YHvO8t6fx/vBA4WOvCq5p0MoC0kLOXc9cyncrPQgVGvfQi48XNLEFgfQyLttsZmA5LmhZvIkh9mczsB1lWQvCQ==</DP><DQ>RP81cPBD36VOH6fo1cZ3+ZQPYfEAaXG6OO+vEkCfssVBxn7jlDXR7SGAp5fyRe7nfwkf9Sd+/d4BVv7EVaXLAQ==</DQ><InverseQ>grNU3qASSC4QYF7X6BB+lxIP3rHbaN0zSeTJtt0jJMNHA48PDv6FrGMj6KPWK0pDDPxKrTdEXD5JixSc8iR+gg==</InverseQ><D>B6P4AV7cxKOWBafhMP9O4ZheSri/eLqSkjbJHzrm2CAiNFHl6ma+dO4/MpY/GNDp7+W+uHAPMLJSV0jM/gGmfpbRAP7WGOaRMToBNwxHV/dwVqnNzjAS6pd8TJGt8lF6AbQla3uSABbyG/YXb59BXKEivPDOuCoFbY+tQTb/Tek=</D></RSAKeyValue>";
                RSACryptoServiceProvider rsa = new RSACryptoServiceProvider(1024);
                rsa.FromXmlString(privateKey);
                signedMessage = Convert.ToBase64String(rsa.SignData(Encoding.UTF8.GetBytes(message), CryptoConfig.MapNameToOID("SHA1")));
            }
            catch (Exception)
            {
                signedMessage = string.Empty;
            }
            return signedMessage;

        }

        public static string CreateMD5(string input)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] inputBytes = Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("X2"));
                }
                return sb.ToString().ToLower();
            }
        }
        
        /// <summary>
        /// The original CreateMD5 wouldn't pass Payme's MD5 check
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string CreateMD5_Alternative(string input)
        {
            var hash = new StringBuilder();
            var md5Provider = new MD5CryptoServiceProvider();
            var bytes = md5Provider.ComputeHash(new UTF8Encoding().GetBytes(input));

            foreach (var t in bytes)
            {
                hash.Append(t.ToString("x2"));
            }
            return hash.ToString();
        }

        public static string HMACSHA256(string text, string key)
        {
            Encoding encoding = Encoding.UTF8;
            Byte[] textBytes = encoding.GetBytes(text);
            Byte[] keyBytes = encoding.GetBytes(key);
            Byte[] hashBytes;
            using (HMACSHA256 hash = new HMACSHA256(keyBytes))
                hashBytes = hash.ComputeHash(textBytes);
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }


        public static string ConvertToUnsign(this string str)
        {
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string temp = str.Normalize(NormalizationForm.FormD);
            return regex.Replace(temp, String.Empty)
                        .Replace('\u0111', 'd').Replace('\u0110', 'D').Replace("'", "''");
        }
        
        public static string RemoveSpecialCharacters(this string str)
        {
            return Regex.Replace(str, "[^a-zA-Z0-9_.]+", "", RegexOptions.Compiled);
        } 

        public static string CUTSTRING(string strText, int MaxLength)
        {
            return (strText.Length <= MaxLength ? strText : strText.Substring(0, MaxLength));
        }

        public static string VARCHARNULL(string strText)
        {
            return strText != "" ? "'" + strText + "'" : "NULL";
        }

        public static object ByteToObject(byte[] value)
        {
            MemoryStream ms1 = new MemoryStream(value);
            BinaryFormatter bf1 = new BinaryFormatter();
            ms1.Position = 0;
            return bf1.Deserialize(ms1);
        }

        public static byte[] ObjectToByte(Object obj)
        {
            MemoryStream ms1 = new MemoryStream();
            BinaryFormatter bf1 = new BinaryFormatter();
            bf1.Serialize(ms1, obj);
            Console.WriteLine(ms1.ToArray().Length.ToString());
            return ms1.ToArray();
        }

        public static Expression<Func<T, bool>> AndAlso<T>(
                this Expression<Func<T, bool>> expr1,
                Expression<Func<T, bool>> expr2)
        {
            var parameter = Expression.Parameter(typeof(T));

            var leftVisitor = new ReplaceExpressionVisitor(expr1.Parameters[0], parameter);
            var left = leftVisitor.Visit(expr1.Body);

            var rightVisitor = new ReplaceExpressionVisitor(expr2.Parameters[0], parameter);
            var right = rightVisitor.Visit(expr2.Body);

            return Expression.Lambda<Func<T, bool>>(
                Expression.AndAlso(left, right), parameter);
        }

        public static List<T> DataReaderToList<T>(SADataReader reader)
        {
            DataTable dt = new DataTable();
            dt.Load(reader);
            return JsonConvert.DeserializeObject<List<T>>(JsonConvert.SerializeObject(dt));
        }

        public static T DataReaderToSingleOrDefault<T>(SADataReader reader)
        {
            DataTable dt = new DataTable();
            dt.Load(reader);
            List<T> lst = JsonConvert.DeserializeObject<List<T>>(JsonConvert.SerializeObject(dt));
            if (lst.Count > 0)
                return lst[0];
            else
                return default(T);
        }

        public static Image Base64ToImage(byte[] imageBytes)
        {
            // Convert byte[] to Image
            using (var ms = new MemoryStream(imageBytes, 0, imageBytes.Length))
            {
                Image image = Image.FromStream(ms, true);
                return image;
            }
        }

        public static bool ObjectsAreEqual(object obj1, object obj2)
        {
            return CreateMD5(JsonConvert.SerializeObject(obj1)) == CreateMD5(JsonConvert.SerializeObject(obj2));
        }
        
        /// <summary>
        /// Use for overriding JsonConverter.WriteJson
        /// Ref: https://stackoverflow.com/a/29281107
        /// </summary>
        /// <param name="writer"></param>
        /// <param name="value"></param>
        /// <param name="serializer"></param>
        public static void WriteJsonWithReflection(JsonWriter writer, object value, JsonSerializer serializer)
        {
            JObject jo = new JObject();
            Type type = value.GetType();

            foreach (PropertyInfo prop in type.GetProperties())
            {
                if (prop.CanRead)
                {
                    object propVal = prop.GetValue(value, null);
                    if (propVal != null)
                    {
                        jo.Add(prop.Name, JToken.FromObject(propVal, serializer));
                    }
                }
            }

            jo.WriteTo(writer);
        }
        
        /// <summary>
        /// Send HTTP Request to an external Service / API
        /// </summary>
        /// <param name="httpMethod"></param>
        /// <param name="pathAndQuery"></param>
        /// <param name="body"></param>
        /// <param name="headers"></param>
        /// <param name="contentType"></param>
        /// <param name="ignoreError"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public static HttpWebResponse SendApiRequest(
            string httpMethod,
            string pathAndQuery,
            string body = null,
            Dictionary<string, object> headers = null,
            string contentType = "application/json",
            bool ignoreError = false
           )
        {
            // Fix TLS. Ref: https://www.codeproject.com/Questions/583133/Theplusunderlyingplusconnectionpluswasplusclosed-3
            ServicePointManager.SecurityProtocol = (SecurityProtocolType) 768 | (SecurityProtocolType) 3072;
            
            HttpWebResponse result = null;
            
            // var uri = new Uri(pathAndQuery);
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(pathAndQuery);
            if(contentType != null)
                httpWebRequest.ContentType = contentType;
            httpWebRequest.Method = httpMethod;
            httpWebRequest.Timeout = int.Parse(WebConfigurationManager.AppSettings["ExternalApiTimeout"]) * 1000;

            if (headers != null && headers.Count > 0)
            {
                foreach (var headerKey in headers.Keys)
                {
                    httpWebRequest.Headers.Add(headerKey.ToString(), headers[headerKey].ToString());
                }
            }

            if (body != null)
            {
                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {
                    streamWriter.Write(body);
                }
            }

            if (ignoreError == false)
            {
                result = (HttpWebResponse)httpWebRequest.GetResponse();
            }
            else
            {
                try
                {
                    result = (HttpWebResponse)httpWebRequest.GetResponse();
                }
                catch (WebException exception)
                {
                    result = exception.Response as HttpWebResponse;
                    if (result == null)
                    {
                        throw;
                    }
                }
            }

            return result;
        }

        public static void SendApiRequestAsync(
            string httpMethod,
            string pathAndQuery,
            string body = null,
            Dictionary<string, object> headers = null,
            string contentType = "application/json",
            bool ignoreError = false)
        {
            new Thread(() =>
            {
                SendApiRequest(httpMethod, pathAndQuery, body, headers, contentType, ignoreError);
            }).Start();
        }
        
        /// <summary>
        /// An Extension Method to conveniently update a DateTime's Time
        /// </summary>
        /// <param name="dateTime"></param>
        /// <param name="hours"></param>
        /// <param name="minutes"></param>
        /// <param name="seconds"></param>
        /// <param name="milliseconds"></param>
        /// <returns></returns>
        public static DateTime ChangeTime(this DateTime dateTime, int hours, int minutes, int seconds, int milliseconds)
        {
            return new DateTime(
                dateTime.Year,
                dateTime.Month,
                dateTime.Day,
                hours,
                minutes,
                seconds,
                milliseconds,
                dateTime.Kind);
        }

        /// <summary>
        /// Generate a GUID with no dash (-)
        /// </summary>
        /// <returns></returns>
        public static string NewGuid()
        {
            return Guid.NewGuid().ToString().Replace("-", "");
        }

        /// <summary>
        /// Remove Accents, similar to ConvertToUnsign but with different implementations:
        /// <para>- Is an extension method</para>
        /// <para>- Based on Encoding difference instead of using RegEx</para>
        /// </summary>
        /// <param name="txt"></param>
        /// <returns></returns>
        public static string RemoveAccent(this string txt) 
        { 
            var bytes = System.Text.Encoding.GetEncoding("Cyrillic").GetBytes(txt); 
            return System.Text.Encoding.ASCII.GetString(bytes); 
        }
        
        /// <summary>
        /// Slugify a string
        /// </summary>
        /// <param name="phrase"></param>
        /// <returns></returns>
        public static string GenerateSlug(this string phrase) 
        { 
            var str = phrase.RemoveAccent().ToLower(); 
            // invalid chars           
            str = Regex.Replace(str, @"[^a-z0-9\s-]", ""); 
            // convert multiple spaces into one space   
            str = Regex.Replace(str, @"\s+", " ").Trim(); 
            // cut and trim 
            str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim();   
            str = Regex.Replace(str, @"\s", "-"); // hyphens   
            return str; 
        }

        public static string GenerateRandom(string chars, int length)
        {
            Random r = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[r.Next(s.Length)])
                .ToArray());
        }

        public static string GenerateRandomDigits(int length)
        {
            return GenerateRandom("0123456789", length);
        }
        
        /// <summary>
        /// Get a list of Tax based on a tax's ApplyOnTop value
        /// </summary>
        /// <param name="applyOnTop">Tax's ApplyOnTop value</param>
        /// <param name="taxes">Venue-wise Taxes. Ensure the list has already been ordered correctly</param>
        /// <returns></returns>

        /// <summary>
        /// Calculate Tax of an Item / Modifier
        /// </summary>
        /// <param name="netTotal"></param>
        /// <param name="itemTaxes">Taxes in scope (Item, Modifier). Ensure the list has already been ordered correctly</param>
        /// <param name="allTaxes">Venue-wise Taxes. Ensure the list has already been ordered correctly</param>
        /// <returns></returns>
        
        public static IEnumerable<string> SplitChunk(string str, int chunkSize)
        {
            return Enumerable.Range(0, str.Length / chunkSize)
                .Select(i => str.Substring(i * chunkSize, chunkSize));
        }

        /// <summary>
        /// 10011 => [0, 1, 4]
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static List<int> GetBitOneIndexes(int value)
        {
            List<int> indexes = new List<int>();
            int remainValue = value;
            int cursor = 0;
            while (remainValue != 0)
            {
                bool isBitOne = (remainValue & 0b_0001) != 0;
                remainValue >>= 1;
                if (isBitOne)
                {
                    indexes.Add(cursor);
                }
                cursor++;
            }

            return indexes;
        }
        
        public static bool CreateShortcutSysbase(string _PathDirectory, string VenueDbName, string VenueName)
        {
            string STARTUP_SHORTCUT_FILEPATH = System.Configuration.ConfigurationManager.AppSettings["StartUpPath"];
            string DB_FILEPATH = System.Configuration.ConfigurationManager.AppSettings["DbPath"] + "\\" + VenueDbName.Split('_')[1]; ;
            string TARGET_DB_PATH = System.Configuration.ConfigurationManager.AppSettings["TargetDbPath"];
            string LinkPathName = STARTUP_SHORTCUT_FILEPATH + "\\" + VenueDbName + ".lnk";
           
            if (!System.IO.File.Exists(LinkPathName))
            {
                try
                {
                    WshShell wsh = new WshShell();

                    IWshRuntimeLibrary.IWshShortcut shortcut = wsh.CreateShortcut(LinkPathName) as IWshRuntimeLibrary.IWshShortcut;

                    string Arguments = "C:\\PIXELSQL\\PIXELSQLBASE10.db -n PixelSQLbase_CreateNew -x TCPIP -ti 0 -c 10M -qp -zt -ch 50% -gb high";
                    shortcut.Arguments = Arguments.Replace("PixelSQLbase_CreateNew", VenueDbName).Replace("C:\\PIXELSQL\\PIXELSQLBASE10.db", DB_FILEPATH + "\\PIXELSQLBASE10.db");
                    shortcut.TargetPath = TARGET_DB_PATH + (TARGET_DB_PATH.Contains("SQL Anywhere 10") ? "\\dbsrv10.exe" : "\\dbsrv12.exe");
                    shortcut.WorkingDirectory = TARGET_DB_PATH;
                    shortcut.WindowStyle = 1;

                    shortcut.Save();
                }
                catch (Exception)
                {
                    return false;
                }
            }
            //LinkPathName
            //File.ReadAllText()
            //using (Process _Process = new Process())
            //{
            //    try
            //    {
            //        //_Process.StartInfo.FileName = LinkPathName;
            //        _Process.StartInfo = new ProcessStartInfo(LinkPathName)
            //        {
            //            UseShellExecute = true,
            //            ErrorDialog = true,
            //            WindowStyle = ProcessWindowStyle.Minimized
            //        };

            //        //p.Start();
            //        _Process.Start();

            //    }
            //    catch (Exception ex)
            //    {
            //        string e = ex.Message.ToString();

            //    }
            //}
            return true;
        }

        public static string CreateTokenSalesForce()
        {
            string _PrivateKey = "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAmgQmGzzZ/rrLA49ncc8GBF1fYWfRuVBwBahrcERnIoDw6YJL\nCFNFVq+3YT1P1iciLcR0W4viUAZKcCreM1BARnDPnzs5P7c0Rpn2Q32MGaxKRCXC\nQ/Zt+Vc2N0l57oPukt4cHYX74/L3WWD6z6ZjtMHJPFPqChO8A734rxpYfQk78v4G\nlFZK5gdSBQ4lLq0xm2FxD9dlxiqQpqpceaDZm0P1Yz9G2bP+QXsNwSd57hCUSC38\nTwvcmMB9i/yTatNm9yG/c1R5YvilVIap4CyHsQ4F/JQa9BW1xEJM1ylUNiYzrgzI\nQcLZPEsRCXlvkL+Vm3Cj2NyYt0a7ZRClfDTKcQIDAQABAoIBAA0mC4bJxCaeFdTg\n+kjaDr5ypkDvlxUGC/o/raRxAokMjwSwbe1xBntnFvXDQTycLKvRmMl0AMcqMlKv\nJjclQ8d/vAnxCWsqHdllLYQHhN1wOwrkWlhpAmyGCIfhyvoU41pAgg/3L1D/niRQ\nRjlSEDMPVDnFRDbGBogfQMraKfHKpRwdQi/fjepa2yta1FwutNkEeMbH+GqQXS4g\nNe4ib0TQSOIfTb5ANDBaMlEm9Ms9f+5yeKsK0rkDn3GCOrjns6b1GJISOUOiy/i/\nVY6PZStY4yonuFNCDmq7226DMcRd9IO/myiHpEYFuhyKJ9ucJCo7bBt4AUqgq/4B\nBINVOgECgYEAy9e7tRJQEwsurBgITUixQQYItxmj3kgMd+ywUsYrkqaguKF2mehC\nK4BI8tbPe7PsxG0rqg/H7lAgMEXGSuyFg88hS99pEkK8KzHxbl/OIaPnPrMyHBow\naUA6CC+pJ4NmuHvmuv3MnuovQNSdUsN8AjD9eJZ44HieuilYN+XcEeECgYEAwWyj\n/ehAy1+jXXxfrHnoTze3il1kBUt6B8ZQDhPkrCeVYywzqEAxD0Nlr7H1/O/dqVUF\nA/t6wZafdRNBe4zKCpEoma8nPDbKbW+e33JqZhvhzVMK2xJXD6ARUfO+8Be+BcGK\nKxdzg658/bh8MQlLdL4nqFAoHJpCfdbgKmcX6pECgYBfsJU4SjF2zyAIv3teNEqp\nWJjMw2eOmEnqHh0jrk2UGU6HfZx8YXB2lVEpVjeuPWdfSlReD+xt7gU+Q/LzBxci\nKiDaSjU70kIdEOPiSW0tk5CheWODl7O0JOdZIm6I0wFshxVoIG5nB05JY8W6rXPQ\nX4kNi62Qym7Qu0nja68kYQKBgQConvpUBp497dEwVZXeeaRRMyR5pjLk/siScIsn\nyqXmgteTzlv2SIe8Y6gJQ95LtByMW0b1Es4QaCv412GVwMX98k/vsqdEsgtE3jMl\nXsxs2c++vK9RDisBvyx6QkDpc/k/cVrveBFG8d2bHrJ92TmDu6Y88CwXy089/w4L\nSTarUQKBgQCkGwUqIiCZumuAhdccFlAV2EEDP7ANxwcSSTkNnD5AHJY0H1MjnIoc\ny/EmHVpR7u1s/URvZPAxQt3J5iI/UB4n/4uksUDbGBEFV0Yr2/1MCfugLXAKYAA7\n+Sbyn/t6xa2hck7cr6mG/Mzq2IOsvqRo3+F2kQJsIaXysSal0+HaKw==\n-----END RSA PRIVATE KEY-----"; //Secret key which will be used later during validation    

            var _Expired = Math.Round(DateTime.Now.Subtract(DateTime.MinValue.AddYears(1969)).TotalSeconds);
            var _Claims = new List<Claim>();

            _Claims.Add(new Claim("iss", "3MVG9aWdXtdHRrI3D9obQdrAEgSLMP5r3s1FLrG_94uQxbRFwBf1RH7pseVlO4p4M6T1UV_2kjD4EId7EadEG"));
            _Claims.Add(new Claim("sub", "wgs@crimsonworks.com.speedpos"));
            _Claims.Add(new Claim("aud", "https://test.salesforce.com"));
            _Claims.Add(new Claim("exp", _Expired.ToString()));
            RSAParameters rsaParams;
            using (var tr = new StringReader(_PrivateKey))
            {
                var pemReader = new PemReader(tr);
                var keyPair = pemReader.ReadObject() as AsymmetricCipherKeyPair;
                if (keyPair == null)
                {
                    throw new Exception("Could not read RSA private key");
                }
                var privateRsaParams = keyPair.Private as RsaPrivateCrtKeyParameters;
                rsaParams = DotNetUtilities.ToRSAParameters(privateRsaParams);
            }
            using (RSACryptoServiceProvider rsa = new RSACryptoServiceProvider())
            {
                rsa.ImportParameters(rsaParams);
                Dictionary<string, object> payload = _Claims.ToDictionary(k => k.Type, v => (object)v.Value);
                return Jose.JWT.Encode(payload, rsa, Jose.JwsAlgorithm.RS256);
            }
        }

        
        /// <summary>
        /// Generate FileName for new Media
        /// </summary>
        /// <returns></returns>
        public static string GenerateMediaFileName(string originalFileName)
        {
            var formattedDate = DateTime.Now.ToString("MM-yyyy");
            var pureFileName = Guid.NewGuid().ToString().Replace("-", "") + Path.GetExtension(originalFileName);
            return $"{formattedDate}_{pureFileName}";
        }
        
        #region BaoVo

        private const int Keysize = 256;
        // This constant determines the number of iterations for the password bytes generation function.
        private const int DerivationIterations = 1000;
        public static string Encrypt(string plainText, string passPhrase)
        {
            // Salt and IV is randomly generated each time, but is preprended to encrypted cipher text
            // so that the same Salt and IV values can be used when decrypting.  
            var saltStringBytes = Generate256BitsOfRandomEntropy();
            var ivStringBytes = Generate256BitsOfRandomEntropy();
            var plainTextBytes = Encoding.UTF8.GetBytes(plainText);
            using (var password = new Rfc2898DeriveBytes(passPhrase, saltStringBytes, DerivationIterations))
            {
                var keyBytes = password.GetBytes(Keysize / 8);
                using (var symmetricKey = new RijndaelManaged())
                {
                    symmetricKey.BlockSize = 256;
                    symmetricKey.Mode = CipherMode.CBC;
                    symmetricKey.Padding = PaddingMode.PKCS7;
                    using (var encryptor = symmetricKey.CreateEncryptor(keyBytes, ivStringBytes))
                    {
                        using (var memoryStream = new MemoryStream())
                        {
                            using (var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                            {
                                cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
                                cryptoStream.FlushFinalBlock();
                                // Create the final bytes as a concatenation of the random salt bytes, the random iv bytes and the cipher bytes.
                                var cipherTextBytes = saltStringBytes;
                                cipherTextBytes = cipherTextBytes.Concat(ivStringBytes).ToArray();
                                cipherTextBytes = cipherTextBytes.Concat(memoryStream.ToArray()).ToArray();
                                memoryStream.Close();
                                cryptoStream.Close();
                                return Convert.ToBase64String(cipherTextBytes);
                            }
                        }
                    }
                }
            }
        }

        public static string Decrypt(string cipherText, string passPhrase)
        {
            // Get the complete stream of bytes that represent:
            // [32 bytes of Salt] + [32 bytes of IV] + [n bytes of CipherText]
            var cipherTextBytesWithSaltAndIv = Convert.FromBase64String(cipherText);
            // Get the saltbytes by extracting the first 32 bytes from the supplied cipherText bytes.
            var saltStringBytes = cipherTextBytesWithSaltAndIv.Take(Keysize / 8).ToArray();
            // Get the IV bytes by extracting the next 32 bytes from the supplied cipherText bytes.
            var ivStringBytes = cipherTextBytesWithSaltAndIv.Skip(Keysize / 8).Take(Keysize / 8).ToArray();
            // Get the actual cipher text bytes by removing the first 64 bytes from the cipherText string.
            var cipherTextBytes = cipherTextBytesWithSaltAndIv.Skip((Keysize / 8) * 2).Take(cipherTextBytesWithSaltAndIv.Length - ((Keysize / 8) * 2)).ToArray();

            using (var password = new Rfc2898DeriveBytes(passPhrase, saltStringBytes, DerivationIterations))
            {
                var keyBytes = password.GetBytes(Keysize / 8);
                using (var symmetricKey = new RijndaelManaged())
                {
                    symmetricKey.BlockSize = 256;
                    symmetricKey.Mode = CipherMode.CBC;
                    symmetricKey.Padding = PaddingMode.PKCS7;
                    using (var decryptor = symmetricKey.CreateDecryptor(keyBytes, ivStringBytes))
                    {
                        using (var memoryStream = new MemoryStream(cipherTextBytes))
                        {
                            using (var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                            {
                                var plainTextBytes = new byte[cipherTextBytes.Length];
                                var decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
                                memoryStream.Close();
                                cryptoStream.Close();
                                return Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount);
                            }
                        }
                    }
                }
            }
        }

        private static byte[] Generate256BitsOfRandomEntropy()
        {
            var randomBytes = new byte[32]; // 32 Bytes will give us 256 bits.
            using (var rngCsp = new RNGCryptoServiceProvider())
            {
                // Fill the array with cryptographically secure random bytes.
                rngCsp.GetBytes(randomBytes);
            }
            return randomBytes;
        }

        #endregion
    }
}