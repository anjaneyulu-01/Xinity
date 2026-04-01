/**
 * Seeds the database with demo submissions for the judge review queue.
 * Runs automatically on server start if no submissions exist.
 */
import Submission from './models/Submission.js'

const DEMO_SUBMISSIONS = [
  {
    projectName:   'Eco Carbon Tracker',
    description:   'Real-time personal and corporate carbon footprint tracker with AI-powered reduction suggestions. The app integrates with IoT sensors, flight databases, and utility APIs to give you an accurate picture of your environmental impact. Features include goal setting, carbon offsetting partnerships, and team challenges.',
    teamName:      'ByteForce',
    eventName:     'WebX Challenge 2026',
    githubUrl:     'https://github.com/demo/eco-carbon',
    demoUrl:       'https://eco-carbon-demo.vercel.app',
    techStack:     ['React', 'Node.js', 'MongoDB', 'TensorFlow'],
    assignedJudgeId:   'j1',
    assignedJudgeName: 'Dr. Priya Mehta',
    status:        'Pending',
  },
  {
    projectName:   'SafeKid AR App',
    description:   'AR-powered child safety application using geofencing and real-time alerts. Parents can set safe zones on a 3D map, receive instant notifications, and communicate with children through the app. Includes panic button, location history, and school bus tracking.',
    teamName:      'CipherX',
    eventName:     'WebX Challenge 2026',
    githubUrl:     'https://github.com/demo/safekid',
    demoUrl:       'https://safekid-demo.vercel.app',
    techStack:     ['Unity', 'ARKit', 'Swift', 'Firebase'],
    assignedJudgeId:   'j1',
    assignedJudgeName: 'Dr. Priya Mehta',
    status:        'Pending',
  },
  {
    projectName:   'MediChain',
    description:   'Decentralised medical records platform on blockchain. Patients control their data — doctors request access, records are encrypted and immutable. Supports HL7 FHIR standard, zero-knowledge proof for privacy, and a mobile-first interface for rural healthcare workers.',
    teamName:      'ByteForge',
    eventName:     'WebX Challenge 2026',
    githubUrl:     'https://github.com/demo/medichain',
    demoUrl:       'https://medichain-demo.vercel.app',
    techStack:     ['Solidity', 'React', 'IPFS', 'Hardhat'],
    assignedJudgeId:   'j1',
    assignedJudgeName: 'Dr. Priya Mehta',
    status:        'Pending',
  },
  {
    projectName:   'AgroSense AI',
    description:   'Precision agriculture platform using drone imagery and ML to detect crop diseases 14 days before they are visible to the naked eye. Includes a farmer-friendly mobile app in 5 regional languages, offline mode for poor connectivity, and marketplace integration for selling surplus produce.',
    teamName:      'GreenBytes',
    eventName:     'WebX Challenge 2026',
    githubUrl:     'https://github.com/demo/agrosense',
    demoUrl:       'https://agrosense-demo.vercel.app',
    techStack:     ['Python', 'PyTorch', 'React Native', 'FastAPI'],
    assignedJudgeId:   'j1',
    assignedJudgeName: 'Dr. Priya Mehta',
    status:        'Pending',
  },
  {
    projectName:   'EduBot',
    description:   'Conversational AI tutor that adapts to each student\'s learning pace. Uses retrieval-augmented generation over your own textbooks — upload your syllabus, and EduBot becomes an expert on your exact curriculum. Tracks weak areas, quizzes on demand, and generates practice papers.',
    teamName:      'DataNinjas',
    eventName:     'AI Hack Sprint 2025',
    githubUrl:     'https://github.com/demo/edubot',
    demoUrl:       'https://edubot-demo.vercel.app',
    techStack:     ['Python', 'LangChain', 'FastAPI', 'Next.js'],
    assignedJudgeId:   'j1',
    assignedJudgeName: 'Dr. Priya Mehta',
    status:        'Pending',
  },
  {
    projectName:   'SmartGrid Optimizer',
    description:   'AI-driven energy grid optimisation that reduces peak-load costs by 30%. The system forecasts demand using LSTM models trained on 5 years of utility data, automatically reroutes power to avoid outages, and integrates renewable sources. Dashboard shows real-time grid health and predictive alerts.',
    teamName:      'VoltWave',
    eventName:     'AI Hack Sprint 2025',
    githubUrl:     'https://github.com/demo/smartgrid',
    demoUrl:       'https://smartgrid-demo.vercel.app',
    techStack:     ['Python', 'TensorFlow', 'Next.js', 'D3.js'],
    assignedJudgeId:   'j1',
    assignedJudgeName: 'Dr. Priya Mehta',
    status:        'Pending',
  },
]

export async function seedSubmissions() {
  const count = await Submission.countDocuments()
  if (count > 0) {
    console.log(`📦 Database already has ${count} submissions — skipping seed`)
    return
  }
  await Submission.insertMany(DEMO_SUBMISSIONS)
  console.log(`🌱 Seeded ${DEMO_SUBMISSIONS.length} demo submissions`)
}
