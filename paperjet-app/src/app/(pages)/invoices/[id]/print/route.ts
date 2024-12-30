import { getCustomer } from "@/data/customers";
import { getInvoice } from "@/data/invoices";
import { verifySession } from "@/lib/session";
import { actionFailure } from "@/lib/utils";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  // Verify user is logged in
  const session = await verifySession();
  if (!session) {
    return NextResponse.json(actionFailure("User not logged in"));
  }

  const { id } = await params;

  // Generate PDF
  const invoice = await getInvoice(session.tenantId, id);
  const json = JSON.stringify({
    html, data: {
      ...invoice,
      formattedIssueDate: invoice?.issueDate ? format(invoice!.issueDate, "dd/MM/yyyy") : null,
      formattedDueDate: invoice?.dueDate ? format(invoice!.dueDate, "dd/MM/yyyy") : null,
      customer: invoice?.customerId ? await getCustomer(session.tenantId, invoice.customerId) : null,
    }
  });

  try {
    const response = await fetch("https://tailwind-pdf-generator.fly.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
    });

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    const pdf = await response.arrayBuffer();
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice!.documentReference}.pdf"`,
      },
    });
  } catch (e) {
    console.error("Error generating PDF", e);
    return NextResponse.json(actionFailure("Error generating PDF"));
  }
}

const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Factuur</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-size: 0.8rem;
        }
        .bg-accent {
            background: black;
        }
    </style>
</head>
<body>
     <div class="flex justify-begin bg-white">
        <div class="container mx-auto p-8">
          <svg class="w-32" viewBox="0 0 2161 653" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 137.079C0 61.3722 61.3722 0 137.079 0H221.575C263.452 0 300.943 18.7784 326.087 48.3739C351.231 18.7784 388.722 0 430.599 0H515.096C590.802 0 652.174 61.3722 652.174 137.079V221.575C652.174 263.451 633.397 300.941 603.804 326.085C633.397 351.229 652.174 388.718 652.174 430.594V515.09C652.174 590.797 590.802 652.169 515.096 652.169H430.599C388.722 652.169 351.231 633.391 326.087 603.795C300.943 633.391 263.452 652.169 221.575 652.169H137.079C61.3722 652.169 0 590.797 0 515.09V430.594C0 388.718 18.7771 351.229 48.3708 326.085C18.7771 300.941 0 263.451 0 221.575V137.079ZM358.657 358.654H515.096C515.245 358.654 515.394 358.653 515.543 358.653C555.07 358.894 587.038 391.01 587.038 430.594V515.09C587.038 554.823 554.828 587.033 515.096 587.033H430.599C390.867 587.033 358.657 554.823 358.657 515.09V358.654ZM515.543 293.516C555.07 293.276 587.038 261.159 587.038 221.575V137.079C587.038 97.3459 554.828 65.1362 515.096 65.1362H430.599C390.867 65.1362 358.657 97.3459 358.657 137.079V293.515H515.096C515.245 293.515 515.394 293.516 515.543 293.516ZM136.83 358.653C136.764 358.653 136.698 358.653 136.632 358.653C97.1046 358.894 65.1362 391.01 65.1362 430.594V515.09C65.1362 554.823 97.3459 587.033 137.079 587.033H221.575C261.308 587.033 293.517 554.823 293.517 515.09V358.654H137.079C136.996 358.654 136.913 358.654 136.83 358.653ZM293.517 137.079V293.515H137.079C136.93 293.515 136.78 293.516 136.631 293.516C97.1045 293.276 65.1362 261.159 65.1362 221.575V137.079C65.1362 97.3459 97.3459 65.1362 137.079 65.1362H221.575C261.308 65.1362 293.517 97.3459 293.517 137.079Z" fill="black"/>
            <path d="M822.609 148.584H949.609C995.943 148.584 1030.61 156.751 1053.61 173.084C1076.61 189.084 1088.11 213.751 1088.11 247.084C1088.11 261.751 1084.94 274.584 1078.61 285.584C1072.61 296.251 1063.61 304.584 1051.61 310.584C1039.94 316.584 1025.78 319.918 1009.11 320.584L1008.61 319.584C1038.94 320.584 1062.28 328.418 1078.61 343.084C1094.94 357.751 1103.11 377.751 1103.11 403.084C1103.11 435.751 1091.61 460.751 1068.61 478.084C1045.94 495.084 1012.94 503.584 969.609 503.584H822.609V148.584ZM970.609 448.584C991.276 448.584 1007.44 444.251 1019.11 435.584C1030.78 426.918 1036.61 414.584 1036.61 398.584C1036.61 382.584 1030.78 370.251 1019.11 361.584C1007.78 352.918 991.609 348.584 970.609 348.584H887.609V448.584H970.609ZM953.609 297.584C975.276 297.584 991.943 293.584 1003.61 285.584C1015.61 277.584 1021.61 266.084 1021.61 251.084C1021.61 235.418 1015.78 223.584 1004.11 215.584C992.776 207.584 975.943 203.584 953.609 203.584H887.609V297.584H953.609ZM1318.77 148.584C1343.43 148.584 1365.1 152.918 1383.77 161.584C1402.77 169.918 1417.6 182.251 1428.27 198.584C1438.93 214.584 1444.27 233.584 1444.27 255.584C1444.27 271.584 1440.77 285.918 1433.77 298.584C1427.1 310.918 1417.93 320.918 1406.27 328.584C1394.6 336.251 1381.77 340.918 1367.77 342.584L1357.27 338.084C1384.27 338.084 1403.93 342.918 1416.27 352.584C1428.93 361.918 1436.27 378.084 1438.27 401.084L1447.27 503.584H1381.77L1374.27 410.584C1373.27 395.251 1367.77 384.584 1357.77 378.584C1347.77 372.584 1331.27 369.584 1308.27 369.584H1235.27V503.584H1170.27V148.584H1318.77ZM1311.77 312.584C1332.77 312.584 1348.93 308.084 1360.27 299.084C1371.6 289.751 1377.27 276.584 1377.27 259.584C1377.27 241.918 1371.6 228.418 1360.27 219.084C1348.93 209.751 1332.77 205.084 1311.77 205.084H1235.27V312.584H1311.77ZM1507.67 148.584H1634.67C1681 148.584 1715.67 156.751 1738.67 173.084C1761.67 189.084 1773.17 213.751 1773.17 247.084C1773.17 261.751 1770 274.584 1763.67 285.584C1757.67 296.251 1748.67 304.584 1736.67 310.584C1725 316.584 1710.83 319.918 1694.17 320.584L1693.67 319.584C1724 320.584 1747.33 328.418 1763.67 343.084C1780 357.751 1788.17 377.751 1788.17 403.084C1788.17 435.751 1776.67 460.751 1753.67 478.084C1731 495.084 1698 503.584 1654.67 503.584H1507.67V148.584ZM1655.67 448.584C1676.33 448.584 1692.5 444.251 1704.17 435.584C1715.83 426.918 1721.67 414.584 1721.67 398.584C1721.67 382.584 1715.83 370.251 1704.17 361.584C1692.83 352.918 1676.67 348.584 1655.67 348.584H1572.67V448.584H1655.67ZM1638.67 297.584C1660.33 297.584 1677 293.584 1688.67 285.584C1700.67 277.584 1706.67 266.084 1706.67 251.084C1706.67 235.418 1700.83 223.584 1689.17 215.584C1677.83 207.584 1661 203.584 1638.67 203.584H1572.67V297.584H1638.67ZM2144.82 148.584L2026.32 325.584L2146.32 503.584H2070.82L1987.32 374.584L1903.82 503.584H1829.32L1949.32 325.084L1830.32 148.584H1905.32L1988.32 275.584L2070.82 148.584H2144.82Z" fill="black"/>
          </svg>
        </div>
     </div>
    <div class="container mx-auto bg-white rounded p-8">
        <div class="mb-6">
            <h1 class="font-bold text-xl mb-2">Factuur <span class="text-purple-700 text-lg">{{documentReference}}</span></h1>
            <p class="">
                Datum: {{formattedIssueDate}}
                {{#formattedDueDate}}
                    &#x2022; Vervaldatum: {{.}}
                {{/formattedDueDate}}
            </p>
        </div>
        <div class="flex mb-8">
            <div class="w-1/2">
                <h2 class="font-bold text-lg mb-2">Klantgegevens</h2>
                {{#customer}}
                <p><strong>{{name}}</strong></p>
                <br/>
                <br/>
                <p>{{address}}</p>
                <p>{{postalCode}} {{city}}</p>
                <p>{{country}}</p>
                <br/>
                <p>BTW {{taxId}}</p>
                {{/customer}}
            </div>
            <div class="w-1/2">
                <h2 class="font-bold text-lg mb-2">Onze Gegevens</h2>
                <p><strong>BRBX BV</strong></p>
                <p>hello@brbx.ai</p>
                <br/>
                <p>Nieuwdorp 5</p>
                <p>3990 Peer</p>
                <p>België</p>
                <br/>
                <p>BTW BE 1012.081.766</p>
            </div>
        </div>
        <div>
            <h2 class="font-bold text-lg mb-2">Artikelen</h2>
            <table class="table-auto w-full mb-6 border-b border-gray-200">
                <thead class="text-left border-b border-gray-300">
                    <tr>
                        <th class="px-4 py-2">Omschrijving</th>
                        <th class="px-4 py-2 text-right whitespace-nowrap" style="min-width: 80px">Aantal</th>
                        <th class="px-4 py-2 text-right whitespace-nowrap" style="min-width: 100px">Prijs</th>
                        <th class="px-4 py-2 text-right whitespace-nowrap" style="min-width: 100px">BTW</th>
                        <th class="px-4 py-2 text-right whitespace-nowrap" style="min-width: 120px">Totaal excl.</th>
                    </tr>
                </thead>
                <tbody>
                {{#lines}}
                    <tr class="border-t border-gray-200">
                        <td class="px-4 py-2">
                            <p class="m-0">{{description}}</p>
                        </td>
                        <td class="px-4 py-2 text-right whitespace-nowrap">{{quantity}}</td>
                        <td class="px-4 py-2 text-right whitespace-nowrap">€ {{unitPrice}}</td>
                        <td class="px-4 py-2 text-right whitespace-nowrap">€ {{taxAmount}}</td>
                        <td class="px-4 py-2 text-right whitespace-nowrap"><strong>€ {{amountBeforeTax}}</strong></td>
                    </tr>
                {{/lines}}
                </tbody>
            </table>
        </div>
        <div class="mt-5 flex justify-end text-right">
            <table>
                <tbody>
                    <tr><td class="pr-8 whitespace-nowrap"><strong>Totaal excl.</strong></td><td class="p-2 pl-0 whitespace-nowrap"> € {{totalAmountBeforeTax}}</td></tr>
                    <tr><td class="pr-8 whitespace-nowrap"><strong>BTW</strong></td><td class="p-2 pl-0 whitespace-nowrap"> € {{taxAmount}}</td></tr>
                    <tr class="bg-gray-100"><td class="p-2 pr-8 whitespace-nowrap"><strong>Totaal</strong></td><td class="p-2 pl-0 whitespace-nowrap"> € {{totalAmountAfterTax}}</td></tr>
                </tbody>
            </table>
        </div>
        <p class="text-right mt-2">KBC BE92 7310 6001 8723</p>
    </div>
    <div class="break-before-page mt-14 text-gray-600 text-xs p-8">
            <h2 class="font-bold text-lg mb-2">Algemene Voorwaarden</h2>
            <div class="space-y-4">
                <p>De factuur moet betaald worden binnen de 30 kalenderdagen na de factuurdatum. Bij laattijdige betaling zal van
                rechtswege en zonder voorafgaande ingebrekestelling, een interest aangerekend worden van 12% per jaar, vermeerderd
                met de gerechtskosten met een minimum van 100,00 EUR en een forfaitaire schadevergoeding van 10% van het
                factuurbedrag.</p>

                <p>Bij laattijdige betaling behouden wij ons het recht voor om verdere prestaties en diensten stop te zetten. Klachten
                dienen schriftelijk binnen de acht dagen te gebeuren. Bij geschillen zijn enkel de rechtbanken van Hasselt bevoegd.
                Enkel het Belgische recht is van toepassing.</p>

                <p>In geval van annulatie van de bestelling is de koper eveneens een forfaitaire schadevergoeding verschuldigd ten
                behoeve van 20% van de waarde van de bestelling, met een minimum van 100 EUR. En dit onder uitdrukkelijk
                voorbehoud van de mogelijkheid om een hogere schade te eisen.</p>

                <p>De verkoper is niet aansprakelijk voor auteursrechten en plagiaat in geleverde bestanden en aangeleverde inhoud.
                Alle geleverde software, ontwerpen en bestanden blijven ten allen tijde eigendom van BRBX BV, tenzij
                anders beschreven in het contract opgesteld tussen de desbetreffende klant en BRBX BV.</p>

                <p>Uitvoeringstermijnen zijn, indien aangegeven, aangegeven bij wijze van inlichting. Laattijdigheid geeft geen aanleiding
                tot schadevergoeding of ontbinding van de overeenkomst.</p>

                <p>In geen geval is BRBX BV aansprakelijk voor onrechtstreekse schade zoals o.a.
                commerciële of financiële verliezen en verlies van data.</p>

                <p>Prijsschommelingen ten opzichte van een (vorige) factuur of offerte zijn mogelijk, bijvoorbeeld omwille van conversies
                tussen verschillende valuta's of omwille van prijsaanpassingen bij leveranciers.</p>
            </div>
      </div>
</body>
</html>
`;