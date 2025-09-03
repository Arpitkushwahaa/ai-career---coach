# AI Career Coach 🚀

An intelligent career development platform powered by AI that helps professionals accelerate their career growth through personalized guidance, interview preparation, and smart resume creation.

## ✨ Features

### 🧠 AI-Powered Career Guidance
- Personalized career advice and insights powered by advanced AI technology
- Industry-specific recommendations and growth strategies
- Real-time career path analysis and suggestions

### 💼 Interview Preparation
- Role-specific interview questions and practice sessions
- Instant feedback and performance analytics
- Behavioral and technical question categories
- AI-generated improvement tips based on performance

### 📊 Industry Insights
- Real-time industry trends and market analysis
- Salary data and compensation insights
- Demand level indicators and growth rates
- Top skills and learning recommendations by industry

### 📝 Smart Resume Creation
- ATS-optimized resume generation with AI assistance
- Markdown-based content management
- Performance scoring and feedback system
- Professional formatting and optimization

### 🔐 User Management
- Secure authentication with Clerk
- Personalized user profiles and preferences
- Progress tracking and assessment history
- Industry-specific customization

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Clerk
- **AI Integration**: Google Generative AI
- **UI Components**: Radix UI, Lucide React Icons
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **PDF Generation**: html2pdf.js
- **Background Jobs**: Inngest

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication
- Google AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-career-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/ai_career_coach"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Google AI
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   
   # Inngest
   INNGEST_EVENT_KEY=your_inngest_event_key
   INNGEST_SIGNING_KEY=your_inngest_signing_key
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database (if seed script exists)
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai-career-coach/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (main)/            # Main application routes
│   │   ├── ai-cover-letter/ # Cover letter generation
│   │   ├── dashboard/      # User dashboard
│   │   ├── interview/      # Interview preparation
│   │   ├── onboarding/     # User onboarding
│   │   └── resume/         # Resume builder
│   ├── api/               # API routes
│   └── lib/               # Utility libraries
├── components/             # Reusable UI components
├── data/                  # Static data files
├── hooks/                 # Custom React hooks
├── lib/                   # Core libraries and utilities
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run postinstall` - Generate Prisma client after install

## 🗄️ Database Schema

The application uses PostgreSQL with the following main models:

- **User**: User profiles, preferences, and industry information
- **Assessment**: Interview practice results and performance data
- **Resume**: User resume content and ATS scoring
- **CoverLetter**: Cover letter content and job application details
- **IndustryInsight**: Industry trends, salary data, and market analysis

## 🌟 Key Features in Detail

### Dashboard
- Personalized career overview and progress tracking
- Recent assessments and performance metrics
- Industry insights and recommendations
- Quick access to resume and cover letter tools

### Interview Preparation
- Category-based question banks (Technical, Behavioral)
- Real-time scoring and feedback
- Performance analytics and improvement suggestions
- Mock interview simulations

### Resume Builder
- AI-assisted content generation
- ATS optimization scoring
- Markdown-based editing
- Professional templates and formatting

### Cover Letter Generator
- AI-powered content creation
- Job description analysis
- Company-specific customization
- Professional formatting options

## 🔐 Authentication

The application uses Clerk for secure user authentication and management, providing:
- Social login options
- Secure session management
- User profile management
- Role-based access control

## 🤖 AI Integration

Powered by Google's Generative AI, the platform provides:
- Intelligent career guidance
- Personalized interview feedback
- Resume optimization suggestions
- Industry trend analysis

## 📱 Responsive Design

Built with Tailwind CSS and modern UI components, the application is fully responsive and provides an excellent user experience across all devices.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Check the [FAQ section](app/page.js#faq) in the application
- Review the [Issues](https://github.com/your-repo/issues) page
- Create a new issue with detailed information

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Authentication by [Clerk](https://clerk.com/)
- AI powered by [Google Generative AI](https://ai.google.dev/)

---

**Ready to accelerate your career?** 🚀 [Start your journey today!](http://localhost:3000/dashboard)
