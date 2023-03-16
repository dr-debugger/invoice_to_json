# invoice_to_json
convert invoice (pdf or image[jpg, png, jpeg]) to json;

* Expected output:

```json
{
  "status": true,
  "data": {
    "data": [
      { "key": "AmountDue", "value": "$610.00" },
      { "key": "BillingAddress", "value": "123 Bill St,\nRedmond WA, 98052" },
      { "key": "BillingAddressRecipient", "value": "Microsoft Finance" },
      { "key": "CustomerAddress", "value": "123 Other St, Redmond WA, 98052" },
      { "key": "CustomerAddressRecipient", "value": "Microsoft Corp" },
      { "key": "CustomerId", "value": "CID-12345" },
      { "key": "CustomerName", "value": "MICROSOFT CORPORATION" },
      { "key": "DueDate", "value": "2019-12-15T00:00:00.000Z" },
      { "key": "InvoiceDate", "value": "2019-11-15T00:00:00.000Z" },
      { "key": "InvoiceId", "value": "INV-100" },
      { "key": "InvoiceTotal", "value": "$110.00" },
      { "key": "PreviousUnpaidBalance", "value": "$500.00" },
      { "key": "PurchaseOrder", "value": "PO-3333" },
      {
        "key": "RemittanceAddress",
        "value": "123 Remit St\nNew York, NY, 10001"
      },
      { "key": "RemittanceAddressRecipient", "value": "Contoso Billing" },
      { "key": "ServiceAddress", "value": "123 Service St, Redmond WA, 98052" },
      { "key": "ServiceAddressRecipient", "value": "Microsoft Services" },
      { "key": "ShippingAddress", "value": "123 Ship St,\nRedmond WA, 98052" },
      { "key": "ShippingAddressRecipient", "value": "Microsoft Delivery" },
      { "key": "SubTotal", "value": "$100.00" },
      { "key": "TotalTax", "value": "$10.00" },
      { "key": "VendorAddress", "value": "123 456th St New York, NY, 10001" },
      { "key": "VendorAddressRecipient", "value": "Contoso Headquarters" },
      { "key": "VendorName", "value": "CONTOSO LTD." }
    ],
    "accuracy": 93.35
  }
}
```
