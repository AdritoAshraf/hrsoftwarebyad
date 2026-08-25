import { FileImage, ExternalLink } from "lucide-react";
import { avatarUrl, type Application } from "@/lib/mock-data";
import { StatusBadge } from "@/components/hr/bits";
import { fmtDate } from "@/lib/hr-utils";

type Row = Record<string, string>;
const g = (r: Row | undefined, k: string) => (r?.[k] ?? "").toString();

function val(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  return String(v);
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 first:mt-0">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Item({ k, v }: { k: string; v: unknown }) {
  return (
    <div className="rounded-xl bg-secondary/60 p-3">
      <p className="text-xs text-muted-foreground">{k}</p>
      <p className="mt-0.5 text-sm font-medium break-words">{val(v)}</p>
    </div>
  );
}

function Repeat({
  title,
  rows,
  fields,
  emptyLabel,
}: {
  title: string;
  rows: Row[];
  fields: [string, string][];
  emptyLabel: string;
}) {
  return (
    <section className="mt-5">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      {rows.length === 0 ? (
        <p className="rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r, i) => (
            <div key={i} className="rounded-xl border border-border p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {title} #{i + 1}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {fields.map(([label, key]) => (
                  <Item key={key} k={label} v={g(r, key)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Doc({ label, name, url }: { label: string; name: string; url?: string }) {
  const body = (
    <>
      <FileImage className="size-5" />
      <span className="max-w-full truncate text-xs">{name || `No ${label.toLowerCase()}`}</span>
      {url && (
        <span className="flex items-center gap-1 text-xs font-medium text-primary">
          Open <ExternalLink className="size-3" />
        </span>
      )}
    </>
  );
  const cls =
    "flex h-28 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-secondary/40 p-3 text-center text-muted-foreground";
  return (
    <div>
      <p className="mb-1.5 text-xs text-muted-foreground">{label}</p>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className={`${cls} hover:bg-secondary`}>
          {body}
        </a>
      ) : (
        <div className={cls}>{body}</div>
      )}
    </div>
  );
}

/** Read-only, grouped summary of a full 5-step application (Step 5 review layout). */
export function ApplicationDetail({ app }: { app: Application }) {
  const d = (app.details ?? {}) as Record<string, unknown>;
  const has = Object.keys(d).length > 0;
  const docUrls = (d["docUrls"] ?? {}) as Record<string, string>;
  const str = (k: string) => (d[k] ?? "") as string;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <img
          src={docUrls["photo"] || avatarUrl(app.name)}
          alt={app.name}
          className="size-20 rounded-2xl bg-secondary object-cover"
        />
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">{app.name}</h2>
          <p className="text-sm text-muted-foreground">
            {app.appliedFor} · submitted {fmtDate(app.submitted)}
          </p>
          <div className="mt-2">
            <StatusBadge status="Pending" />
          </div>
        </div>
      </div>

      <Group title="Application">
        <Item k="Application ID" v={app.id} />
        <Item k="Position Applied For" v={app.appliedFor} />
        <Item k="Submitted" v={fmtDate(app.submitted)} />
        <Item k="Requested Rate" v={`£${app.rate.toFixed(2)} / hour`} />
      </Group>

      {!has && (
        <Group title="Personal Details">
          <Item k="Phone" v={app.phone} />
          <Item k="Email" v={app.email} />
          <Item k="Address" v={app.address} />
          <Item k="NID Number" v={app.nid} />
          <Item k="Preferred Location" v={app.location} />
        </Group>
      )}

      {has && (
        <>
          <Group title="Personal Details">
            <Item k="Title" v={str("title")} />
            <Item k="Surname" v={str("surname")} />
            <Item k="Forename" v={str("forename")} />
            <Item k="Date of Birth" v={str("dob")} />
            <Item k="Surname at Birth" v={str("surnameAtBirth")} />
            <Item k="Date of Name Change" v={str("nameChangeDate")} />
          </Group>

          <Group title="Contact Information">
            <Item k="Mobile" v={str("mobile") || app.phone} />
            <Item k="Email" v={str("email") || app.email} />
          </Group>

          <Group title="Current Address">
            <Item k="Address Line 1" v={str("addr1")} />
            <Item k="Address Line 2" v={str("addr2")} />
            <Item k="Address Line 3" v={str("addr3")} />
            <Item k="Town" v={str("town")} />
            <Item k="County" v={str("county")} />
            <Item k="Postcode" v={str("postcode")} />
            <Item k="Country" v={str("country")} />
            <Item k="At Address From" v={str("atAddressFrom")} />
          </Group>

          <Repeat
            title="Previous Address"
            rows={(d["prevAddresses"] as Row[]) ?? []}
            emptyLabel="No previous addresses provided."
            fields={[
              ["Address Line 1", "addr1"],
              ["Address Line 2", "addr2"],
              ["Address Line 3", "addr3"],
              ["Town", "town"],
              ["County", "county"],
              ["Postcode", "postcode"],
              ["Country", "country"],
              ["From", "from"],
              ["To", "to"],
            ]}
          />

          <Group title="Nationality">
            <Item k="Town / Place of Birth" v={str("birthPlace")} />
            <Item k="Nationality" v={str("nationality")} />
            <Item k="National Insurance No" v={str("ni")} />
            <Item k="Permitted to work in the UK" v={str("rightToWork")} />
          </Group>

          <Group title="Next of Kin / Emergency Contact">
            <Item k="Forename" v={str("kinForename")} />
            <Item k="Surname" v={str("kinSurname")} />
            <Item k="Phone" v={str("kinPhone")} />
            <Item k="Address Line 1" v={str("kinAddr1")} />
            <Item k="Address Line 2" v={str("kinAddr2")} />
            <Item k="Address Line 3" v={str("kinAddr3")} />
            <Item k="Town" v={str("kinTown")} />
            <Item k="County" v={str("kinCounty")} />
            <Item k="Postcode" v={str("kinPostcode")} />
            <Item k="Country" v={str("kinCountry")} />
          </Group>

          <section className="mt-5">
            <h3 className="mb-2 text-sm font-semibold">Documents</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Doc label="Profile Photo" name={str("photo")} url={docUrls["photo"]} />
              <Doc label="NID / ID Front" name={str("idFront")} url={docUrls["idFront"]} />
              <Doc label="NID / ID Back" name={str("idBack")} url={docUrls["idBack"]} />
              <Doc
                label="Proof of Address"
                name={str("proofAddress")}
                url={docUrls["proofAddress"]}
              />
            </div>
          </section>

          <Group title="Right to Work / Visa">
            <Item k="Holds work permit / visa" v={str("hasVisa")} />
            <Item k="Visa Type" v={str("visaType")} />
            <Item k="Visa Expiry" v={str("visaExpiry")} />
          </Group>

          <Group title="Bank Details">
            <Item k="Bank Name" v={str("bankName")} />
            <Item k="Account Holder" v={str("accountHolder")} />
            <Item k="Sort Code" v={str("sortCode")} />
            <Item k="Account Number" v={str("accountNumber")} />
          </Group>

          <Group title="Health & Accessibility">
            <Item k="Medical conditions" v={str("medical")} />
            <Item k="Dietary / accessibility needs" v={str("dietary")} />
          </Group>

          <Group title="Previous Employment With Us">
            <Item k="Worked here before" v={str("workedBefore")} />
            <Item k="From" v={str("workedFrom")} />
            <Item k="To" v={str("workedTo")} />
            <Item k="Reason for leaving" v={str("workedReason")} />
          </Group>

          <Repeat
            title="Employment Record"
            rows={(d["employers"] as Row[]) ?? []}
            emptyLabel="No employment history provided."
            fields={[
              ["Employer", "name"],
              ["Role / Position", "role"],
              ["Address", "address"],
              ["Town", "town"],
              ["Postcode", "postcode"],
              ["Phone", "phone"],
              ["Email", "email"],
              ["From", "from"],
              ["To", "to"],
              ["Reason for Leaving", "reason"],
            ]}
          />

          <Repeat
            title="Character Referee"
            rows={(d["referees"] as Row[]) ?? []}
            emptyLabel="No referees provided."
            fields={[
              ["Name", "name"],
              ["Phone", "phone"],
              ["Email", "email"],
              ["Address", "address"],
              ["Years Known", "years"],
              ["Relationship", "relationship"],
            ]}
          />

          <Repeat
            title="Skills & Qualifications"
            rows={(d["skills"] as Row[]) ?? []}
            emptyLabel="No qualifications provided."
            fields={[
              ["Qualification", "name"],
              ["Date Attained", "attained"],
              ["Expiry Date", "expiry"],
              ["Certificate Number", "certNo"],
            ]}
          />

          <Group title="Availability">
            <Item k="Preferred Locations" v={d["prefLocations"]} />
            <Item k="Preferred Hours" v={str("availability")} />
            <Item k="Expected Hourly Rate" v={str("expectedRate") ? `£${str("expectedRate")}` : ""} />
          </Group>
        </>
      )}
    </div>
  );
}
