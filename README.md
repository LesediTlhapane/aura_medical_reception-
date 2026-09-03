Aura Medical Reception
Technical & Product Documentation
3 September 2026

Frontend	React/Vite Aura application — existing demo UI
Automation	n8n WhatsApp AI Receptionist — built and verified on happy path
AI	Google Gemini Flash via n8n AI Agent
Next milestone	Connect Aura Web to the same receptionist engine via Webhook
 
1. Executive Summary
Aura Medical Reception is a React/Vite-based medical reception interface designed to demonstrate how an AI receptionist can handle common clinic administration tasks such as answering frequently asked questions, identifying doctor availability, supporting appointment requests, and escalating unsupported or sensitive requests to human staff.
The original Aura prototype contains a polished frontend experience but uses local, simulated logic for AI responses, clinic information, booking, and practice metrics. The new n8n workflow introduces a real backend automation layer using Google Gemini Flash, conversation memory, Google Sheets tools, and WhatsApp.
The target architecture is to connect both Aura Web and WhatsApp to the same reusable AI Reception Engine. Aura will communicate with n8n through an HTTP webhook, while WhatsApp will continue to use the WhatsApp Trigger. Both channels should share the same receptionist rules, clinic data, appointment logic, and safety controls.
2. Project Goals
Primary goals:
•	Provide a professional AI medical receptionist experience.
•	Answer clinic administration questions using structured clinic data.
•	Check doctor availability before discussing appointment availability.
•	Check existing appointments before confirming a slot.
•	Create bookings only after explicit patient confirmation.
•	Maintain conversation context.
•	Escalate emergencies, unsupported requests, and sensitive situations.
•	Support both a web-based Aura interface and WhatsApp.
•	Prepare the architecture for future client clinics without rebuilding the application.
Non-goals:
•	The system is not a diagnostic or treatment system.
•	The AI must not replace medical professionals.
•	The AI should not invent clinical information.
•	The current demo is not yet a production-ready medical records system.
3. Current System Status
Frontend: Aura Medical Reception React/Vite application exists and runs as a polished interactive demo.
Frontend intelligence: Currently simulated through src/utils/aiEngine.js and src/data/clinicData.js.
Frontend booking: Currently simulated locally in useChatSession.js and generates local SRM-style references. This must be replaced by real n8n booking results.
Frontend metrics: Currently simulated and incremented locally. They should be clearly labelled as demo/illustrative metrics until connected to real event data.
n8n WhatsApp workflow: Built and verified on the happy path. Workflow ID: p4onbhYdsexEAlCG.
n8n AI stack:
•	WhatsApp Trigger
•	Text-message filter
•	AI Receptionist Agent
•	Google Gemini Flash
•	Simple Memory
•	Google Sheets FAQ tool
•	Google Sheets doctor availability tool
•	Google Sheets appointment lookup tool
•	Google Sheets booking append tool
•	Human handoff tool
•	WhatsApp reply
•	WhatsApp error reply
Aura Web integration: Planned; the recommended implementation is a Webhook → normalized request → shared AI receptionist → Respond to Webhook path.
4. Technology Stack
Frontend:
•	React 19
•	Vite
•	Tailwind CSS 4
•	Framer Motion
•	Lucide React
•	Browser localStorage
•	Web Audio API for notification sounds
Backend / automation:
•	n8n Cloud
•	Google Gemini Flash
•	n8n AI Agent
•	n8n Simple Memory
•	Google Sheets
•	WhatsApp Business API / n8n WhatsApp nodes
Current frontend package dependencies do not include an HTTP client library; the native browser fetch API is sufficient for the planned webhook integration.
5. Frontend Architecture
Current frontend flow:
App.jsx
  └── useChatSession()
        ├── ChatWindow
        ├── BookingWizard
        ├── ConfirmationCard
        └── ImpactDashboard
Current live chat logic:
ChatWindow
  → useChatSession.sendPatientMessage()
  → aiEngine.js
  → clinicData.js
  → local response / local booking
Target live chat logic:
ChatWindow
  → useChatSession.sendPatientMessage()
  → auraApi.js
  → n8n Aura Webhook
  → AI Receptionist
  → JSON response
  → useChatSession
  → ChatWindow
The UI should remain largely unchanged. The principal change is replacing the local business logic with calls to the n8n backend.
6. Key Frontend Files
src/App.jsx
Purpose: Main application composition. Controls the landing page, demo workspace, view mode, chat session, and strategy-call modal.
src/hooks/useChatSession.js
Purpose: Main client-side session controller. Currently manages messages, language, local persistence, sound, booking state, emergency state, and simulated metrics. This is the primary file to refactor for n8n integration.
src/utils/aiEngine.js
Purpose: Current simulated receptionist logic. It performs keyword matching, emergency detection, FAQ matching, specialist matching, and canned responses. It should no longer be the source of truth for live conversations.
src/data/clinicData.js
Purpose: Current hard-coded demo clinic data including Sunrise Medical Centre, doctors, services, prices, medical aids, operating hours, logistics, and contact information. Keep only as presentation/fallback data if desired; do not use it as the live AI data source.
src/components/ChatWindow.jsx
Purpose: Chat presentation layer. Renders messages, quick actions, booking wizard, receipts, emergency cards, clinic status, and input controls.
src/components/BookingWizard.jsx
Purpose: Structured booking UI. It currently submits to the local completion handler. It should eventually submit booking information to n8n or operate as an optional UI around the same backend.
src/components/ConfirmationCard.jsx
Purpose: Displays confirmed booking information. It should consume booking data returned by n8n rather than locally generated booking data.
src/components/ImpactDashboard.jsx
Purpose: Displays simulated practice metrics and recent bookings. Replace hard-coded metrics with real event data in a later phase.
src/utils/audio.js
Purpose: Browser notification chime. Can remain unchanged.
7. n8n WhatsApp Workflow
Current workflow:
WhatsApp Trigger
  ↓
Only Text Messages
  ↓
AI Receptionist Agent
  ├── Google Gemini Chat Model
  ├── Simple Memory
  ├── get_faqs
  ├── get_doctor_availability
  ├── check_appointments
  ├── create_booking
  └── human_handoff
  ↓
Send WhatsApp Reply
Error output from the AI Agent:
  ↓
Send Error Reply
Workflow ID:
p4onbhYdsexEAlCG
The existing WhatsApp workflow should remain functional while the Aura Web channel is added. Avoid creating a second independent AI receptionist with duplicated rules.
8. Recommended Multi-Channel Architecture
The long-term architecture should separate channel transport from receptionist intelligence.
                    ┌── WhatsApp Trigger ──┐
                    │                       │
                    │                       ▼
                    │                Normalize Message
                    │                       │
Aura Web → Webhook ─┴───────────────────────┤
                                            ▼
                                  Shared Reception Engine
                                            │
                           ┌────────────────┼─────────────────┐
                           ▼                ▼                 ▼
                        Gemini            Memory          Clinic Tools
                                                              │
                                         ┌────────────────────┼───────────────┐
                                         ▼                    ▼               ▼
                                        FAQs                Doctors       Appointments
                                                                                │
                                                                                ▼
                                                                            Booking
                                            │
                                  ┌─────────┴──────────┐
                                  ▼                    ▼
                             WhatsApp Reply      Web JSON Response
The critical principle is that the same AI receptionist rules and business data are used regardless of channel.
9. Aura Web API Contract
Aura should call an n8n Webhook using POST.
Request:
{
  "sessionId": "aura-web-123",
  "message": "What time are you open?",
  "clinicId": "demo-clinic",
  "channel": "web",
  "patientPhone": ""
}
Required fields:
•	sessionId — stable browser/session identifier.
•	message — patient's current message.
•	clinicId — identifies the clinic configuration.
•	channel — use "web" for Aura.
•	patientPhone — optional for web; required/known for WhatsApp.
Recommended response for a normal message:
{
  "success": true,
  "message": "AI response",
  "type": "text",
  "bookingConfirmed": false,
  "payload": null
}
Confirmed booking:
{
  "success": true,
  "message": "Your appointment has been confirmed.",
  "type": "receipt",
  "bookingConfirmed": true,
  "payload": {
    "bookingId": "APT-...",
    "patientName": "...",
    "doctor": "...",
    "specialty": "...",
    "date": "...",
    "time": "...",
    "reason": "...",
    "status": "confirmed"
  }
}
Emergency:
{
  "success": true,
  "message": "Emergency response message",
  "type": "emergency",
  "bookingConfirmed": false,
  "payload": null
}
Human handoff:
{
  "success": true,
  "message": "I've escalated this to the clinic team. A staff member will assist you.",
  "type": "handoff",
  "bookingConfirmed": false,
  "payload": null
}
Backend failure:
{
  "success": false,
  "message": "I'm sorry, the clinic reception system is temporarily unavailable. Please try again.",
  "type": "error",
  "bookingConfirmed": false
}
10. n8n Normalization
The Webhook should be followed by a normalization step.
Normalized fields:
•	message
•	sessionId
•	clinicId
•	channel
•	patientPhone
For Aura:
message = webhook message
sessionId = webhook sessionId
clinicId = webhook clinicId
channel = web
patientPhone = webhook patientPhone
For WhatsApp:
message = WhatsApp message body
sessionId = WhatsApp number/session
clinicId = configured clinic identifier
channel = whatsapp
patientPhone = WhatsApp sender number
The AI Agent should consume the normalized message field rather than referencing WhatsApp-specific JSON paths.
11. Conversation Memory
Current WhatsApp memory uses a custom session key based on the WhatsApp ID.
Recommended cross-channel key:
clinicId + "_" + channel + "_" + sessionId
Examples:
demo-clinic_web_aura123
demo-clinic_whatsapp_27821234567
This prevents conversations from different clinics, channels, or patients from sharing context.
The current memory window is 15 messages. This is acceptable for the demo but should be evaluated using real conversation patterns before production deployment.
12. Clinic Data Model
For the demonstration environment, create a Google Spreadsheet named:
AURA Demo Clinic Database
Tab: FAQs
Columns:
category | question | answer
Tab: Doctors
Columns:
doctor_name | specialty | working_days | start_time | end_time | availability_status
Tab: Appointments
Columns:
booking_id | patient_name | phone | doctor_name | specialty | appointment_date | appointment_time | reason | status | created_at
Google Sheets should be the source of truth for the demo.
The existing FAQ tool is currently pointed at a spreadsheet named "#1 AICTE OIB-SIP AL1 2024". This should be replaced with the demo clinic spreadsheet.
The remaining Google Sheets tools also need the correct spreadsheet selected.
13. Receptionist Behaviour
The receptionist should:
•	Respond professionally and naturally.
•	Keep WhatsApp/web responses concise.
•	Use clinic data rather than memory or assumptions for factual clinic information.
•	Ask only for missing booking information.
•	Ask one useful question at a time.
•	Check doctor availability before presenting a slot as available.
•	Check existing appointments before confirming a slot.
•	Require explicit patient confirmation before creating a booking.
•	Return the real booking ID after successful creation.
•	Never claim a booking succeeded when the booking tool failed.
•	Escalate unsupported or sensitive requests.
•	Never reveal another patient's information.
Required booking information:
•	Full name
•	Contact number when required
•	Doctor or specialty
•	Date
•	Time
•	General appointment reason
Do not collect unnecessary medical details.
14. Safety and Medical Scope
Aura is an administrative receptionist, not a medical professional.
It must not:
•	Diagnose conditions.
•	Prescribe medication.
•	Provide definitive treatment advice.
•	Pretend to be a doctor.
•	Use another patient's information.
•	Invent medical or clinic facts.
Emergency handling should take priority over scheduling. If a user describes potentially life-threatening symptoms, the system should advise immediate emergency medical care and, where appropriate, alert clinic staff.
The current frontend emergency card contains demo-specific emergency numbers. These must be treated as fictional/demo values and replaced with verified client-specific emergency information before any real deployment.
POPIA and privacy claims should not be treated as certification merely because the UI displays "POPIA COMPLIANT". Before a production deployment, perform an appropriate legal, security, data-processing, access-control, retention, and privacy review.
15. Booking Lifecycle
Recommended booking lifecycle:
1. Patient expresses appointment intent.
2. AI identifies doctor/specialty and preferred date/time.
3. AI collects missing details.
4. get_doctor_availability checks the requested doctor/specialty schedule.
5. check_appointments checks existing bookings for the requested date.
6. AI determines whether the requested time conflicts with an existing booking.
7. If unavailable, AI offers verified alternatives.
8. AI displays a confirmation summary.
9. Patient explicitly confirms.
10. create_booking appends the appointment.
11. The real booking ID is returned.
12. Aura or WhatsApp displays the confirmation.
Never generate a booking reference in the browser.
Current frontend SRM-style booking IDs must eventually be removed from the live booking path.
16. Frontend Booking Strategy
The existing BookingWizard should be preserved initially because it is a useful UI component.
However, it should become an interface to the backend rather than the booking engine itself.
Two supported experiences are recommended:
A. Conversational booking
Patient describes what they need in natural language. The AI collects missing information and completes the booking after confirmation.
B. Structured booking
Patient opens the existing BookingWizard, selects or enters details, and the wizard submits those details to n8n.
Both routes must eventually use the same n8n booking tools and validation rules.
17. Environment Configuration
Add a frontend environment variable:
VITE_N8N_AURA_WEBHOOK_URL=<n8n webhook URL>
Do not place any of the following in the React application:
•	Gemini API keys
•	Google Sheets credentials
•	WhatsApp access tokens
•	n8n credentials
•	Clinic staff credentials
Only the public webhook endpoint needed by the frontend should be exposed.
For local development, use a .env.local file and do not commit secrets.
18. Security Considerations
Important controls:
•	Validate webhook input.
•	Limit request size.
•	Apply rate limiting where appropriate.
•	Do not expose credentials to the browser.
•	Use HTTPS.
•	Avoid logging unnecessary patient information.
•	Restrict Google Sheet access to required accounts.
•	Separate demo data from real patient data.
•	Use stable clinic and session identifiers.
•	Prevent cross-clinic data access.
•	Review data retention and deletion requirements.
•	Consider a transactional database for production appointments.
•	Protect human-handoff destinations.
•	Audit n8n workflow permissions and credentials.
Google Sheets is suitable for the demonstration environment, but it is not an ideal transactional appointment database for a high-volume clinical production system.
19. Current Known Limitations
1. Aura's live AI is currently local/simulated.
2. Aura's booking confirmation is currently simulated.
3. Aura's practice metrics are simulated.
4. Clinic data is currently hard-coded in clinicData.js.
5. n8n FAQ data is currently pointed to the wrong spreadsheet.
6. Several n8n Google Sheets tools still require a spreadsheet selection.
7. WhatsApp credentials and sender phone number ID are still required for live WhatsApp operation.
8. Human handoff currently assumes WhatsApp as the notification channel.
9. Appointment conflict checking relies on Google Sheets and AI interpretation.
10. Concurrent booking protection is not transactional.
11. Client-specific emergency information is not yet configured.
12. Multi-clinic isolation is planned but not yet implemented.
20. Testing Plan
Functional tests:
FAQ:
•	Ask opening hours.
•	Ask location.
•	Ask services.
•	Ask fees.
•	Ask payment/medical aid questions.
Doctor:
•	Ask which doctors are available.
•	Ask for a particular specialty.
•	Ask for a specific doctor.
Booking:
•	Book with a named doctor.
•	Book by specialty.
•	Omit one required field and verify the AI asks for it.
•	Request an unavailable time.
•	Request a time already in Appointments.
•	Confirm a booking.
•	Reject a confirmation.
•	Attempt a duplicate booking.
Safety:
•	Emergency symptoms.
•	Unsupported medical advice.
•	Request for another patient's information.
•	Human handoff.
Failure:
•	Gemini unavailable.
•	Google Sheets unavailable.
•	Booking append fails.
•	Webhook returns invalid response.
•	Network timeout.
Channel:
•	Run the same scenario through Aura Web.
•	Run the same scenario through WhatsApp.
•	Verify both channels use the same clinic rules.
•	Verify sessions remain isolated.
21. Recommended Implementation Roadmap
Phase 1 — Stabilise n8n
•	Create the Aura Web Webhook.
•	Normalize requests.
•	Make the AI Agent channel-independent.
•	Update memory key.
•	Add Respond to Webhook.
•	Keep WhatsApp working.
Phase 2 — Connect Aura
•	Add src/services/auraApi.js.
•	Add VITE_N8N_AURA_WEBHOOK_URL.
•	Replace local chat responses in useChatSession.js.
•	Preserve existing UI.
Phase 3 — Make bookings real
•	Remove local booking ID generation.
•	Connect BookingWizard to n8n.
•	Populate ConfirmationCard from the n8n response.
•	Test duplicate and unavailable bookings.
Phase 4 — Make the demo honest
•	Rename Live Practice Metrics Simulator to Demo Performance.
•	Label fictional clinic data as demo data.
•	Remove or qualify hard-coded uptime and ROI claims.
Phase 5 — Production hardening
•	Introduce clinicId-based configuration.
•	Move appointment storage to a transactional database or scheduling system.
•	Add authentication/authorization where needed.
•	Implement logging, monitoring, rate limiting, and privacy controls.
•	Verify client-specific emergency and escalation procedures.
Phase 6 — Client onboarding
•	Create a clinic configuration process.
•	Load clinic FAQs, doctors, schedules, services, policies and contacts.
•	Connect the client's WhatsApp Business account.
•	Configure human handoff.
•	Test with approved client data.
22. Future Multi-Clinic Model
The product should eventually support:
clinicId
  ↓
Clinic Configuration
  ├── Clinic profile
  ├── FAQs
  ├── Services
  ├── Doctors
  ├── Schedules
  ├── Booking rules
  ├── Emergency instructions
  └── Human escalation contacts
The same Aura frontend and receptionist engine should then serve multiple practices.
Example:
demo-clinic
client-001
client-002
client-003
The clinic ID must be validated server-side so a user cannot simply submit another clinic ID and access that clinic's information.
23. Recommended Production Architecture
For a production deployment, the ideal architecture is:
Aura Web / WhatsApp
        ↓
Channel-specific n8n entry point
        ↓
Input validation + normalization
        ↓
Shared Reception Engine
        ↓
Gemini Flash + Memory + deterministic business tools
        ↓
Clinic data service
        ↓
Transactional appointment system
        ↓
Response / human handoff
Google Sheets can remain useful for simple configuration during the early stage, but appointment availability and booking should eventually use a system designed for concurrent transactional scheduling.
24. Project Success Criteria
Aura can be considered successfully integrated when:
•	A patient can send a message through Aura.
•	The message reaches n8n.
•	Gemini processes the request.
•	Memory persists the conversation.
•	Clinic information comes from Google Sheets.
•	Doctor availability comes from Google Sheets.
•	Existing appointments are checked.
•	Bookings are only created after confirmation.
•	The real booking ID is returned to Aura.
•	ConfirmationCard displays the real booking.
•	Errors never produce fake success.
•	Emergency requests trigger the correct safety response.
•	Human handoff works.
•	WhatsApp continues to operate.
•	Web and WhatsApp use the same receptionist rules.
•	No secrets are exposed in the frontend.
25. Reference Workflow
Current verified WhatsApp workflow:
Workflow name:
WhatsApp AI Clinic Receptionist & Appointment Booking
Workflow ID:
p4onbhYdsexEAlCG
Core nodes:
•	WhatsApp Trigger
•	Only Text Messages
•	AI Receptionist Agent
•	Google Gemini Chat Model
•	Simple Memory
•	get_faqs
•	get_doctor_availability
•	check_appointments
•	create_booking
•	human_handoff
•	Send WhatsApp Reply
•	Send Error Reply
Target Aura Web flow:
Webhook
→ Normalize Aura Request
→ Shared AI Receptionist
→ Respond to Webhook
The AI/business logic should ultimately be shared rather than duplicated across workflows.




<img width="1559" height="711" alt="Screenshot_3-9-2026_105458_leseditlhapane app n8n cloud" src="https://github.com/user-attachments/assets/0ae43d1b-902a-4a9f-a107-ae22838fb5db" />
