using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace SpeedCoreWeb.Codes
{
    public static class JsonCompressor
    {
        private static readonly Dictionary<string, string> CompressedKeyMaps = new Dictionary<string, string>()
        {
            { "ac", "IsActive" },
            { "cc", "ColorCode" },
            { "clI", "ClientID" },
            { "co", "Count" },
            { "de", "Description" },
            { "dl", "IsDelete" },
            { "dn", "DisplayName" },
            { "fp", "ForcePriceType" },
            { "gp", "GrossPrice" },
            { "icI", "ItemComboID" },
            { "icO", "ItemCombo" },
            { "iclI", "ItemComboLinkID" },
            { "iclS", "ItemComboLinks" },
            { "itI", "ItemID" },
            { "itO", "Item" },
            { "itn", "ItemName" },
            { "ma", "Max" },
            { "mgI", "ModifierGroupID" },
            { "mgO", "ModifierGroup" },
            { "mi", "Min" },
            { "moI", "ModifierID" },
            { "moL", "Modifiers" },
            { "na", "Name" },
            { "np", "NetPrice" },
            { "osI", "OptionSetID" },
            { "osS", "OptionSets" },
            { "pm", "PriceMode" },
            { "pt", "PriceType" },
            { "re", "IsRequired" },
            { "sc", "Schedule" },
            { "scI", "SaleChannelID" },
            { "sd", "SizeDown" },
            { "seI", "SectionID" },
            { "siI", "SaleItemID" },
            { "sit", "SaleItemType" },
            { "sm", "IsStackModifier" },
            { "spI", "SalePriceID" },
            { "su", "SizeUp" },
            { "t", "Type" },
            { "toiI", "TableOrderItemID" },
            { "topI", "TableOrderPageID" },
            { "tr1", "TaxRate1" },
            { "tr2", "TaxRate2" },
            { "tr3", "TaxRate3" },
            { "tr4", "TaxRate4" },
            { "tr5", "TaxRate5" },
            { "tv1", "TaxValue1" },
            { "tv2", "TaxValue2" },
            { "tv3", "TaxValue3" },
            { "tv4", "TaxValue4" },
            { "tv5", "TaxValue5" },
            { "up", "UnitPrice" },
            { "vnI", "VenueID" },
        };

        private static readonly Dictionary<string, string> OriginalKeyMaps =
            CompressedKeyMaps.ToDictionary((i) => i.Value, (i) => i.Key);

        public static object Compress(object obj, bool isRemoveNull = true)
        {
            JObject originalObj = JObject.FromObject(obj);
            JObject compressedObj = new JObject();
            foreach (KeyValuePair<string, JToken> objPropNameValuePair in originalObj)
            {
                if (isRemoveNull && objPropNameValuePair.Value.Type == JTokenType.Null)
                {
                    continue;
                }

                string newObjPropName = OriginalKeyMaps.ContainsKey(objPropNameValuePair.Key)
                    ? OriginalKeyMaps[objPropNameValuePair.Key]
                    : objPropNameValuePair.Key;
                JToken newObjPropValue = objPropNameValuePair.Value;
                
                switch (objPropNameValuePair.Value.Type)
                {
                    case JTokenType.Object:
                    {
                        newObjPropValue = JObject.FromObject(Compress(newObjPropValue.ToObject<object>(), isRemoveNull));
                        break;
                    }
                    case JTokenType.Array:
                    {
                        newObjPropValue = JArray.FromObject(Compress(newObjPropValue.ToArray(), isRemoveNull));
                        break;
                    }
                }

                compressedObj.Add(newObjPropName, newObjPropValue);
            }

            return compressedObj.ToObject<object>();
        }

        public static object Compress(IEnumerable<object> objList, bool isRemoveNull = true)
        {
            JArray compressedObjList = new JArray();
            foreach (object obj in objList)
            {
                compressedObjList.Add(Compress(obj, isRemoveNull));
            }

            return compressedObjList.ToObject<object>();
        }
    }
}