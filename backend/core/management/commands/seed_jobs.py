from django.core.management.base import BaseCommand
from core.models import JobListing

class Command(BaseCommand):
    help = 'Seed realistic job listings'

    def handle(self, *args, **options):
        # Clear existing jobs
        JobListing.objects.all().delete()
        
        # Create comprehensive job listings
        jobs = [
            {
                'title': 'Senior Software Engineer',
                'company': 'TechCorp',
                'location': 'San Francisco, CA',
                'description': 'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing and implementing scalable web applications using modern technologies. The ideal candidate has experience with Python, Django, and cloud platforms.',
                'keywords': ['python', 'django', 'aws', 'postgresql', 'docker', 'kubernetes', 'rest api', 'microservices']
            },
            {
                'title': 'Frontend Developer',
                'company': 'StartupXYZ',
                'location': 'Remote',
                'description': 'Join our innovative startup as a Frontend Developer. You will work on building beautiful, responsive user interfaces using React and modern CSS frameworks. Experience with TypeScript and state management is preferred.',
                'keywords': ['react', 'typescript', 'tailwind', 'javascript', 'css', 'html', 'redux', 'next.js']
            },
            {
                'title': 'Full Stack Developer',
                'company': 'Digital Agency',
                'location': 'New York, NY',
                'description': 'We need a Full Stack Developer who can work on both frontend and backend development. You will be involved in the entire development lifecycle, from concept to deployment. Strong problem-solving skills and attention to detail required.',
                'keywords': ['python', 'javascript', 'react', 'node.js', 'mongodb', 'express', 'git', 'agile']
            },
            {
                'title': 'DevOps Engineer',
                'company': 'CloudTech',
                'location': 'Austin, TX',
                'description': 'Looking for a DevOps Engineer to help us scale our infrastructure. You will be responsible for CI/CD pipelines, monitoring, and automation. Experience with AWS, Docker, and Kubernetes is essential.',
                'keywords': ['aws', 'docker', 'kubernetes', 'terraform', 'jenkins', 'python', 'bash', 'monitoring']
            },
            {
                'title': 'Data Scientist',
                'company': 'Analytics Inc',
                'location': 'Seattle, WA',
                'description': 'Join our data science team to build machine learning models and analyze large datasets. You will work with Python, R, and various ML frameworks. PhD in a quantitative field preferred.',
                'keywords': ['python', 'machine learning', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'sql', 'statistics']
            },
            {
                'title': 'Mobile App Developer',
                'company': 'AppStudio',
                'location': 'Los Angeles, CA',
                'description': 'We are seeking a Mobile App Developer to create iOS and Android applications. Experience with React Native or Flutter is required. You will work closely with our design team to create intuitive user experiences.',
                'keywords': ['react native', 'flutter', 'ios', 'android', 'javascript', 'swift', 'kotlin', 'mobile development']
            },
            {
                'title': 'Backend Engineer',
                'company': 'API Solutions',
                'location': 'Remote',
                'description': 'Looking for a Backend Engineer to build robust APIs and microservices. You will work with Python, Django, and various databases. Experience with caching, queuing systems, and performance optimization is a plus.',
                'keywords': ['python', 'django', 'fastapi', 'postgresql', 'redis', 'celery', 'rest api', 'graphql']
            },
            {
                'title': 'UI/UX Designer',
                'company': 'Design Co',
                'location': 'Portland, OR',
                'description': 'We need a creative UI/UX Designer to join our design team. You will create user-centered designs for web and mobile applications. Proficiency in Figma, Sketch, and Adobe Creative Suite is required.',
                'keywords': ['figma', 'sketch', 'adobe', 'ui design', 'ux design', 'prototyping', 'user research', 'design systems']
            },
            {
                'title': 'Product Manager',
                'company': 'Product Labs',
                'location': 'Chicago, IL',
                'description': 'Join our product team as a Product Manager. You will be responsible for defining product strategy, working with engineering teams, and analyzing user feedback. Experience with agile methodologies and data analysis is preferred.',
                'keywords': ['product management', 'agile', 'scrum', 'analytics', 'user research', 'strategy', 'roadmap', 'stakeholder management']
            },
            {
                'title': 'Cybersecurity Analyst',
                'company': 'SecureTech',
                'location': 'Washington, DC',
                'description': 'We are looking for a Cybersecurity Analyst to help protect our systems and data. You will monitor security events, conduct vulnerability assessments, and implement security controls. CISSP or similar certification preferred.',
                'keywords': ['cybersecurity', 'security analysis', 'vulnerability assessment', 'incident response', 'firewall', 'siem', 'penetration testing', 'compliance']
            },
            {
                'title': 'Machine Learning Engineer',
                'company': 'AI Innovations',
                'location': 'Boston, MA',
                'description': 'Join our AI team as a Machine Learning Engineer. You will develop and deploy machine learning models, work with large datasets, and collaborate with data scientists. Strong programming skills and ML experience required.',
                'keywords': ['machine learning', 'python', 'tensorflow', 'pytorch', 'mlops', 'data engineering', 'model deployment', 'deep learning']
            },
            {
                'title': 'Cloud Architect',
                'company': 'CloudFirst',
                'location': 'Denver, CO',
                'description': 'We need a Cloud Architect to design and implement cloud solutions. You will work with AWS, Azure, or GCP to build scalable, secure, and cost-effective cloud infrastructure. Experience with infrastructure as code is essential.',
                'keywords': ['aws', 'azure', 'gcp', 'cloud architecture', 'terraform', 'kubernetes', 'microservices', 'serverless']
            },
            {
                'title': 'QA Engineer',
                'company': 'Quality Assurance Co',
                'location': 'Remote',
                'description': 'Looking for a QA Engineer to ensure the quality of our software products. You will design and execute test plans, automate testing processes, and work closely with development teams. Experience with Selenium and test automation is preferred.',
                'keywords': ['qa', 'testing', 'selenium', 'automation', 'test cases', 'bug tracking', 'agile', 'quality assurance']
            },
            {
                'title': 'Technical Writer',
                'company': 'Documentation Pro',
                'location': 'Remote',
                'description': 'We are seeking a Technical Writer to create clear, comprehensive documentation for our software products. You will work with engineering teams to document APIs, user guides, and technical specifications. Strong writing skills and technical background required.',
                'keywords': ['technical writing', 'documentation', 'api documentation', 'user guides', 'markdown', 'git', 'software documentation', 'content creation']
            },
            {
                'title': 'Sales Engineer',
                'company': 'Tech Sales Inc',
                'location': 'Miami, FL',
                'description': 'Join our sales team as a Sales Engineer. You will work with potential customers to understand their technical requirements and demonstrate how our solutions can meet their needs. Technical background and sales experience preferred.',
                'keywords': ['sales engineering', 'technical sales', 'customer demos', 'solution architecture', 'presentation skills', 'relationship building', 'technical consulting', 'enterprise sales']
            }
        ]
        
        for job_data in jobs:
            JobListing.objects.create(**job_data)
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(jobs)} job listings')
        )

