-- Seed data for Advanced Hospital Staffing (dev/testing only)
-- Run after schema.sql. Uses organization slug to upsert related records.

do $$
declare
  org_id uuid;
  bullhorn_ds uuid;
  hubspot_ds uuid;
  csv_ds uuid;
  pipeline_dashboard uuid;
  margin_dashboard uuid;
  audit_id uuid;
  dim_org_id uuid;
  client_mercy uuid;
  client_bayview uuid;
  client_ridgeview uuid;
  facility_mercy_icu uuid;
  facility_mercy_er uuid;
  facility_bayview uuid;
  recruiter_sasha uuid;
  recruiter_priya uuid;
  recruiter_ethan uuid;
  candidate_alex uuid;
  candidate_maya uuid;
  candidate_jordan uuid;
  job_ccu uuid;
  job_er uuid;
  job_therapy uuid;
begin
  -- Ensure organization exists
  select id into org_id from organizations where slug = 'advanced-hospital-staffing';
  if org_id is null then
    insert into organizations (id, name, slug, timezone)
    values (
      gen_random_uuid(),
      'Advanced Hospital Staffing',
      'advanced-hospital-staffing',
      'America/Chicago'
    )
    returning id into org_id;
  else
    update organizations
      set name = 'Advanced Hospital Staffing',
          timezone = coalesce(timezone, 'America/Chicago')
    where id = org_id;
  end if;

  -- Data sources
  select id into bullhorn_ds
  from data_sources
  where organization_id = org_id and type = 'bullhorn';
  if bullhorn_ds is null then
    insert into data_sources (organization_id, type, name, status)
    values (org_id, 'bullhorn', 'Bullhorn ATS', 'connected')
    returning id into bullhorn_ds;
  else
    update data_sources
      set name = 'Bullhorn ATS', status = 'connected'
    where id = bullhorn_ds;
  end if;

  select id into hubspot_ds
  from data_sources
  where organization_id = org_id and type = 'hubspot';
  if hubspot_ds is null then
    insert into data_sources (organization_id, type, name, status)
    values (org_id, 'hubspot', 'HubSpot CRM', 'warning')
    returning id into hubspot_ds;
  else
    update data_sources
      set name = 'HubSpot CRM', status = 'warning'
    where id = hubspot_ds;
  end if;

  select id into csv_ds
  from data_sources
  where organization_id = org_id and type = 'csv';
  if csv_ds is null then
    insert into data_sources (organization_id, type, name, status)
    values (org_id, 'csv', 'CSV Uploads', 'pending')
    returning id into csv_ds;
  else
    update data_sources
      set name = 'CSV Uploads', status = 'pending'
    where id = csv_ds;
  end if;

  -- Dashboards
  select id into pipeline_dashboard
  from dashboards
  where organization_id = org_id and powerbi_report_id = 'pipeline-efficiency-report';
  if pipeline_dashboard is null then
    insert into dashboards (
      organization_id,
      name,
      powerbi_report_id,
      powerbi_dataset_id
    )
    values (
      org_id,
      'Pipeline Efficiency',
      'pipeline-efficiency-report',
      'pipeline-efficiency-dataset'
    )
    returning id into pipeline_dashboard;
  else
    update dashboards
      set name = 'Pipeline Efficiency',
          powerbi_dataset_id = 'pipeline-efficiency-dataset'
    where id = pipeline_dashboard;
  end if;

  select id into margin_dashboard
  from dashboards
  where organization_id = org_id and powerbi_report_id = 'margin-intelligence-report';
  if margin_dashboard is null then
    insert into dashboards (
      organization_id,
      name,
      powerbi_report_id,
      powerbi_dataset_id
    )
    values (
      org_id,
      'Margin Intelligence',
      'margin-intelligence-report',
      'margin-intelligence-dataset'
    )
    returning id into margin_dashboard;
  else
    update dashboards
      set name = 'Margin Intelligence',
          powerbi_dataset_id = 'margin-intelligence-dataset'
    where id = margin_dashboard;
  end if;

  -- Audit logs (remove prior seed entries)
  delete from audit_logs
  where organization_id = org_id
    and metadata ->> 'seed' = 'advanced-hospital-staffing';

  insert into audit_logs (organization_id, user_id, action, target, metadata)
  values
    (
      org_id,
      null,
      'gateway.health.warning',
      'On-premises Gateway 01',
      jsonb_build_object(
        'seed', 'advanced-hospital-staffing',
        'message', 'Latency spike detected and auto-resolved',
        'severity', 'warning'
      )
    ),
    (
      org_id,
      null,
      'powerbi.embed.issued',
      'Margin Intelligence',
      jsonb_build_object(
        'seed', 'advanced-hospital-staffing',
        'issued_by', 'service_principal',
        'report_id', 'margin-intelligence-report'
      )
    ),
    (
      org_id,
      null,
      'compliance.alert.created',
      'Expiring Credentials',
      jsonb_build_object(
        'seed', 'advanced-hospital-staffing',
        'count', 11
      )
    );

  -- Dim organization
  select id into dim_org_id
  from dim_organization
  where organization_id = org_id;
  if dim_org_id is null then
    insert into dim_organization (organization_id, name, timezone)
    values (org_id, 'Advanced Hospital Staffing', 'America/Chicago')
    returning id into dim_org_id;
  else
    update dim_organization
      set name = 'Advanced Hospital Staffing',
          timezone = 'America/Chicago'
    where id = dim_org_id;
  end if;

  -- Dim time snapshots
  insert into dim_time (date_key, date, week, month, quarter, year)
  values
    (20250310, date '2025-03-10', 11, 3, 1, 2025),
    (20250309, date '2025-03-09', 11, 3, 1, 2025),
    (20250303, date '2025-03-03', 10, 3, 1, 2025),
    (20250224, date '2025-02-24', 9, 2, 1, 2025)
  on conflict (date_key) do nothing;

  -- Clients
  select id into client_mercy
  from dim_client
  where organization_id = org_id and name = 'Mercy General';
  if client_mercy is null then
    insert into dim_client (organization_id, name, segment, region)
    values (org_id, 'Mercy General', 'Health System', 'Midwest')
    returning id into client_mercy;
  else
    update dim_client
      set segment = 'Health System', region = 'Midwest'
    where id = client_mercy;
  end if;

  select id into client_bayview
  from dim_client
  where organization_id = org_id and name = 'Bayview Clinic Network';
  if client_bayview is null then
    insert into dim_client (organization_id, name, segment, region)
    values (org_id, 'Bayview Clinic Network', 'Outpatient', 'Southeast')
    returning id into client_bayview;
  else
    update dim_client
      set segment = 'Outpatient', region = 'Southeast'
    where id = client_bayview;
  end if;

  select id into client_ridgeview
  from dim_client
  where organization_id = org_id and name = 'Ridgeview Health Partners';
  if client_ridgeview is null then
    insert into dim_client (organization_id, name, segment, region)
    values (org_id, 'Ridgeview Health Partners', 'Managed Service', 'West')
    returning id into client_ridgeview;
  else
    update dim_client
      set segment = 'Managed Service', region = 'West'
    where id = client_ridgeview;
  end if;

  -- Facilities
  select id into facility_mercy_icu
  from dim_facility
  where organization_id = org_id and name = 'Mercy General ICU';
  if facility_mercy_icu is null then
    insert into dim_facility (organization_id, client_id, name, facility_type)
    values (org_id, client_mercy, 'Mercy General ICU', 'Hospital')
    returning id into facility_mercy_icu;
  else
    update dim_facility
      set client_id = client_mercy, facility_type = 'Hospital'
    where id = facility_mercy_icu;
  end if;

  select id into facility_mercy_er
  from dim_facility
  where organization_id = org_id and name = 'Mercy General ER';
  if facility_mercy_er is null then
    insert into dim_facility (organization_id, client_id, name, facility_type)
    values (org_id, client_mercy, 'Mercy General ER', 'Hospital')
    returning id into facility_mercy_er;
  else
    update dim_facility
      set client_id = client_mercy, facility_type = 'Hospital'
    where id = facility_mercy_er;
  end if;

  select id into facility_bayview
  from dim_facility
  where organization_id = org_id and name = 'Bayview Ambulatory Care';
  if facility_bayview is null then
    insert into dim_facility (organization_id, client_id, name, facility_type)
    values (org_id, client_bayview, 'Bayview Ambulatory Care', 'Clinic')
    returning id into facility_bayview;
  else
    update dim_facility
      set client_id = client_bayview, facility_type = 'Clinic'
    where id = facility_bayview;
  end if;

  -- Recruiters
  select id into recruiter_sasha
  from dim_recruiter
  where organization_id = org_id and name = 'Sasha Nguyen';
  if recruiter_sasha is null then
    insert into dim_recruiter (organization_id, name, team)
    values (org_id, 'Sasha Nguyen', 'Critical Care')
    returning id into recruiter_sasha;
  else
    update dim_recruiter
      set team = 'Critical Care'
    where id = recruiter_sasha;
  end if;

  select id into recruiter_priya
  from dim_recruiter
  where organization_id = org_id and name = 'Priya Patel';
  if recruiter_priya is null then
    insert into dim_recruiter (organization_id, name, team)
    values (org_id, 'Priya Patel', 'Allied Health')
    returning id into recruiter_priya;
  else
    update dim_recruiter
      set team = 'Allied Health'
    where id = recruiter_priya;
  end if;

  select id into recruiter_ethan
  from dim_recruiter
  where organization_id = org_id and name = 'Ethan Lee';
  if recruiter_ethan is null then
    insert into dim_recruiter (organization_id, name, team)
    values (org_id, 'Ethan Lee', 'Travel Nursing')
    returning id into recruiter_ethan;
  else
    update dim_recruiter
      set team = 'Travel Nursing'
    where id = recruiter_ethan;
  end if;

  -- Candidates
  select id into candidate_alex
  from dim_candidate
  where organization_id = org_id and specialty = 'ICU Nurse' and license_state = 'TX';
  if candidate_alex is null then
    insert into dim_candidate (organization_id, specialty, license_state, status)
    values (org_id, 'ICU Nurse', 'TX', 'active')
    returning id into candidate_alex;
  else
    update dim_candidate
      set status = 'active'
    where id = candidate_alex;
  end if;

  select id into candidate_maya
  from dim_candidate
  where organization_id = org_id and specialty = 'ER Nurse' and license_state = 'IL';
  if candidate_maya is null then
    insert into dim_candidate (organization_id, specialty, license_state, status)
    values (org_id, 'ER Nurse', 'IL', 'active')
    returning id into candidate_maya;
  else
    update dim_candidate
      set status = 'active'
    where id = candidate_maya;
  end if;

  select id into candidate_jordan
  from dim_candidate
  where organization_id = org_id and specialty = 'Respiratory Therapist' and license_state = 'FL';
  if candidate_jordan is null then
    insert into dim_candidate (organization_id, specialty, license_state, status)
    values (org_id, 'Respiratory Therapist', 'FL', 'credentialing')
    returning id into candidate_jordan;
  else
    update dim_candidate
      set status = 'credentialing'
    where id = candidate_jordan;
  end if;

  -- Jobs
  select id into job_ccu
  from dim_job
  where organization_id = org_id and facility_id = facility_mercy_icu;
  if job_ccu is null then
    insert into dim_job (
      organization_id,
      client_id,
      facility_id,
      specialty,
      seniority,
      rate_plan
    )
    values (
      org_id,
      client_mercy,
      facility_mercy_icu,
      'CCU Nurse',
      'Senior',
      'Hourly'
    )
    returning id into job_ccu;
  else
    update dim_job
      set client_id = client_mercy,
          specialty = 'CCU Nurse',
          seniority = 'Senior',
          rate_plan = 'Hourly'
    where id = job_ccu;
  end if;

  select id into job_er
  from dim_job
  where organization_id = org_id and facility_id = facility_mercy_er;
  if job_er is null then
    insert into dim_job (
      organization_id,
      client_id,
      facility_id,
      specialty,
      seniority,
      rate_plan
    )
    values (
      org_id,
      client_mercy,
      facility_mercy_er,
      'ER Nurse',
      'Mid',
      'Hourly'
    )
    returning id into job_er;
  else
    update dim_job
      set client_id = client_mercy,
          specialty = 'ER Nurse',
          seniority = 'Mid',
          rate_plan = 'Hourly'
    where id = job_er;
  end if;

  select id into job_therapy
  from dim_job
  where organization_id = org_id and facility_id = facility_bayview;
  if job_therapy is null then
    insert into dim_job (
      organization_id,
      client_id,
      facility_id,
      specialty,
      seniority,
      rate_plan
    )
    values (
      org_id,
      client_bayview,
      facility_bayview,
      'Respiratory Therapist',
      'Senior',
      'Contract'
    )
    returning id into job_therapy;
  else
    update dim_job
      set client_id = client_bayview,
          specialty = 'Respiratory Therapist',
          seniority = 'Senior',
          rate_plan = 'Contract'
    where id = job_therapy;
  end if;

  -- Clear previous fact data for this org (seed only)
  delete from fact_compliance where organization_id = org_id;
  delete from fact_margin where organization_id = org_id;
  delete from fact_revenue where organization_id = org_id;
  delete from fact_shift where organization_id = org_id;
  delete from fact_placement where organization_id = org_id;
  delete from fact_offer where organization_id = org_id;
  delete from fact_interview where organization_id = org_id;
  delete from fact_submission where organization_id = org_id;

  -- Facts: submissions
  insert into fact_submission (
    organization_id,
    time_key,
    job_id,
    candidate_id,
    recruiter_id,
    status
  )
  values
    (org_id, 20250310, job_ccu, candidate_alex, recruiter_sasha, 'submitted'),
    (org_id, 20250310, job_ccu, candidate_maya, recruiter_priya, 'reviewed'),
    (org_id, 20250309, job_er, candidate_maya, recruiter_priya, 'interview'),
    (org_id, 20250303, job_therapy, candidate_jordan, recruiter_ethan, 'credentialing');

  -- Facts: interviews
  insert into fact_interview (
    organization_id,
    time_key,
    job_id,
    candidate_id,
    recruiter_id,
    outcome
  )
  values
    (org_id, 20250310, job_ccu, candidate_alex, recruiter_sasha, 'advanced'),
    (org_id, 20250309, job_er, candidate_maya, recruiter_priya, 'offer'),
    (org_id, 20250303, job_therapy, candidate_jordan, recruiter_ethan, 'pending');

  -- Facts: offers
  insert into fact_offer (
    organization_id,
    time_key,
    job_id,
    candidate_id,
    recruiter_id,
    accepted
  )
  values
    (org_id, 20250309, job_er, candidate_maya, recruiter_priya, true),
    (org_id, 20250303, job_therapy, candidate_jordan, recruiter_ethan, false);

  -- Facts: placements
  insert into fact_placement (
    organization_id,
    time_key,
    job_id,
    candidate_id,
    recruiter_id,
    start_date,
    end_date,
    bill_rate,
    pay_rate
  )
  values
    (
      org_id,
      20250309,
      job_er,
      candidate_maya,
      recruiter_priya,
      date '2025-03-17',
      date '2025-06-17',
      145.00,
      95.00
    ),
    (
      org_id,
      20250224,
      job_ccu,
      candidate_alex,
      recruiter_sasha,
      date '2025-03-03',
      date '2025-05-26',
      152.00,
      98.00
    );

  -- Facts: shifts
  insert into fact_shift (
    organization_id,
    time_key,
    facility_id,
    hours,
    billed_amount,
    paid_amount
  )
  values
    (org_id, 20250310, facility_mercy_icu, 96, 18240, 11760),
    (org_id, 20250303, facility_mercy_er, 72, 12480, 7920),
    (org_id, 20250224, facility_bayview, 60, 9000, 5400);

  -- Facts: revenue
  insert into fact_revenue (
    organization_id,
    time_key,
    client_id,
    facility_id,
    amount,
    category
  )
  values
    (org_id, 20250310, client_mercy, facility_mercy_icu, 89000, 'Temp Staffing'),
    (org_id, 20250303, client_mercy, facility_mercy_er, 62000, 'Temp Staffing'),
    (org_id, 20250224, client_bayview, facility_bayview, 38000, 'Managed Service');

  -- Facts: margin
  insert into fact_margin (
    organization_id,
    time_key,
    client_id,
    gross_profit,
    margin_pct
  )
  values
    (org_id, 20250310, client_mercy, 42000, 34.5),
    (org_id, 20250303, client_mercy, 31500, 32.0),
    (org_id, 20250224, client_bayview, 18200, 28.5);

  -- Facts: compliance
  insert into fact_compliance (
    organization_id,
    time_key,
    candidate_id,
    credential_type,
    status
  )
  values
    (org_id, 20250310, candidate_alex, 'BLS Certification', 'current'),
    (org_id, 20250310, candidate_maya, 'ACLS Certification', 'expiring'),
    (org_id, 20250303, candidate_jordan, 'Respiratory License', 'outstanding');
end;
$$;

