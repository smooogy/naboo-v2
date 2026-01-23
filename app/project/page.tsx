'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  UserIcon, 
  Folder02Icon, 
  Logout03Icon, 
  Menu01Icon,
  UserMultiple02Icon,
  Briefcase01Icon,
  Calendar03Icon,
  ArrowRight01Icon,
  Building06Icon,
  Restaurant01Icon,
  SwimmingIcon,
  ChefIcon,
  Menu09Icon,
  MapsIcon,
  GridViewIcon,
  Edit02Icon,
  Download04Icon,
  Delete02Icon,
  Add01Icon,
  Settings02Icon,
  Notification03Icon,
  Mail01Icon,
  FileAttachmentIcon,
  Image01Icon,
  File01Icon,
  Location01Icon,
  MoneyBag02Icon,
  Target01Icon,
  PaintBoardIcon
} from '@hugeicons/core-free-icons';
import { ColorPaletteExplorer, useColorPaletteSettings } from '@/components/ColorPaletteExplorer';

// Assets
const imgLogo = "/assets/logo-v2.svg";

// Venue images for proposals
const venueImages = {
  proposal1: "/assets/new-venue/1.webp",
  proposal2: [
    "/fake_data/2_x31747387155525.webp",
    "/fake_data/67ec1746325615525.webp",
    "/fake_data/8Eqz1751896085806.webp",
  ],
  proposal3: "/fake_data/cq7_1759329005051.webp",
};

// Types
interface Proposal {
  id: number;
  status: 'ready' | 'waiting';
  venueName: string;
  location: string;
  additionalVenues?: number;
  participants: number;
  dateRange: string;
  estimatedTotal: string;
  pricePerPerson: string;
  vendors: {
    venue: number;
    catering: number;
    activities: number;
    staffIncluded: boolean;
  };
  images: string | string[];
}

// Sample data
const proposals: Proposal[] = [
  {
    id: 1,
    status: 'ready',
    venueName: "The Standard, East Village",
    location: "New York, NY, United States",
    participants: 160,
    dateRange: "May 04 - May 20",
    estimatedTotal: "25 000,00 €",
    pricePerPerson: "45,00 € HT / personne · Includes 6 vendors",
    vendors: {
      venue: 1,
      catering: 2,
      activities: 3,
      staffIncluded: true,
    },
    images: venueImages.proposal1,
  },
  {
    id: 2,
    status: 'waiting',
    venueName: "L'abbaye de Royaumont",
    location: "Asnières-sur-Oise, 95344, France",
    additionalVenues: 2,
    participants: 160,
    dateRange: "May 04 - May 20",
    estimatedTotal: "25 000,00 €",
    pricePerPerson: "45,00 € HT /personne",
    vendors: {
      venue: 2,
      catering: 2,
      activities: 3,
      staffIncluded: true,
    },
    images: venueImages.proposal2,
  },
  {
    id: 3,
    status: 'ready',
    venueName: "Château de Fontainebleau",
    location: "Fontainebleau, 77300, France",
    participants: 160,
    dateRange: "May 04 - May 20",
    estimatedTotal: "32 500,00 €",
    pricePerPerson: "52,00 € HT /personne",
    vendors: {
      venue: 1,
      catering: 1,
      activities: 2,
      staffIncluded: false,
    },
    images: venueImages.proposal3,
  },
];

// Vendor Pill Component
function VendorPill({ icon, label, count }: { icon: React.ReactNode; label: string; count?: number }) {
  return (
    <div className="bg-white border border-border flex items-center gap-1 h-8 pl-1.5 pr-2 py-1 rounded-full">
      <div className="flex items-center justify-center px-1.5 h-4">
        {icon}
      </div>
      <span className="font-sans font-medium text-[15px] text-black tracking-[-0.3px] leading-[1.2]">
        {label}
      </span>
      {count && count > 1 && (
        <div className="bg-grey-light flex items-center justify-center px-2.5 rounded-full">
          <span className="font-sans font-medium text-[14px] text-black tracking-[-0.14px]">{count}</span>
        </div>
      )}
    </div>
  );
}

// Sample vendor details for compare view
const vendorDetails = {
  proposal1: {
    venue: { name: "The Standard, East Village", image: "/assets/new-venue/1.webp", status: 'available' as const },
    catering: { name: "Traiteur Lenôtre", image: "/fake_data/2_x31747387155525.webp", status: 'pending' as const },
    activities: { name: "Team Building Pro", image: "/fake_data/67ec1746325615525.webp", status: 'available' as const },
  },
  proposal2: {
    venue: { name: "Château de Chantilly", image: "/fake_data/8Eqz1751896085806.webp", status: 'pending' as const },
    catering: { name: "Chef à domicile", image: "/fake_data/cq7_1759329005051.webp", status: 'available' as const },
    activities: { name: "Escape Game Corp", image: "/fake_data/EwsP1753099615389.webp", status: 'pending' as const },
  },
  proposal3: {
    venue: { name: "Château de Fontainebleau", image: "/fake_data/cq7_1759329005051.webp", status: 'available' as const },
    catering: { name: "Maison Potel & Chabot", image: "/fake_data/-BfE1765823942802.webp", status: 'available' as const },
    activities: { name: "Nature & Découverte", image: "/fake_data/2_x31747387155525.webp", status: 'available' as const },
  },
};

// Vendor Item Component for Compare View
function VendorCompareItem({ name, image, status }: { name: string; image: string; status: 'available' | 'pending' }) {
  return (
    <div className="flex items-center gap-2">
      <img src={image} alt={name} className="w-10 h-10 rounded object-cover shrink-0" />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-sans font-medium text-[13px] text-black tracking-[-0.26px] truncate">
          {name}
        </span>
        {status === 'available' ? (
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#2D7255' }} />
            <span className="font-sans text-[11px]" style={{ color: '#2D7255' }}>Ready to book</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#737876" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="font-sans text-[11px] text-grey">Pending</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Compare View Component
function CompareView({ proposals, onReview }: { proposals: Proposal[]; onReview: () => void }) {
  const rows = [
    { label: 'Estimated Total', key: 'total' },
    { label: 'Per Person', key: 'pricePerPerson' },
    { label: 'Participants', key: 'participants' },
    { label: 'Date', key: 'date' },
    { label: 'Included vendors', key: 'vendorsSeparator', isSeparator: true },
    { label: 'Venue', key: 'venueDetail' },
    { label: 'Catering', key: 'cateringDetail' },
    { label: 'Activities', key: 'activitiesDetail' },
  ];

  const getVendorDetails = (proposalId: number) => {
    if (proposalId === 1) return vendorDetails.proposal1;
    if (proposalId === 2) return vendorDetails.proposal2;
    return vendorDetails.proposal3;
  };

  const renderCell = (proposal: Proposal, key: string) => {
    const vendors = getVendorDetails(proposal.id);
    
    switch (key) {
      case 'total':
        return (
          <span className="font-sans font-medium text-[20px] text-black tracking-[-0.4px]">
            {proposal.estimatedTotal} <span className="text-[14px] text-grey">HT</span>
          </span>
        );
      case 'pricePerPerson':
        return (
          <span className="font-sans text-[14px] text-grey tracking-[-0.28px]">
            {proposal.pricePerPerson}
          </span>
        );
      case 'participants':
        return (
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={UserMultiple02Icon} size={14} className="text-black" strokeWidth={1.5} />
            <span className="font-sans font-medium text-[14px] text-black tracking-[-0.28px]">
              {proposal.participants} participants
            </span>
          </div>
        );
      case 'date':
        return (
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={Calendar03Icon} size={14} className="text-black" strokeWidth={1.5} />
            <span className="font-sans font-medium text-[14px] text-black tracking-[-0.28px]">
              {proposal.dateRange}
            </span>
          </div>
        );
      case 'venueDetail':
        return <VendorCompareItem {...vendors.venue} />;
      case 'cateringDetail':
        return <VendorCompareItem {...vendors.catering} />;
      case 'activitiesDetail':
        return <VendorCompareItem {...vendors.activities} />;
      default:
        return null;
    }
  };

  const images = (proposal: Proposal) => Array.isArray(proposal.images) ? proposal.images : [proposal.images];

  return (
    <div className="overflow-x-auto">
      <div className="bg-white border border-border rounded overflow-hidden min-w-max">
        {/* Header Row - Venue Info with Image */}
        <div className="flex">
          <div className="w-[140px] shrink-0 p-4 bg-background-secondary sticky left-0 z-10" />
          {proposals.map((proposal) => (
            <div key={proposal.id} className="w-[280px] shrink-0 p-4">
              {/* Image */}
              <div className="w-full h-28 rounded overflow-hidden mb-3">
                <img
                  src={images(proposal)[0]}
                  alt={proposal.venueName}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Venue Name & Location */}
              <div className="flex flex-col gap-1 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-sans font-medium text-[16px] text-black tracking-[-0.32px]">
                    {proposal.venueName}
                  </h3>
                  {proposal.additionalVenues && (
                    <span className="font-sans text-[13px] text-grey">
                      +{proposal.additionalVenues}
                    </span>
                  )}
                </div>
                <p className="font-sans text-[13px] text-grey tracking-[-0.26px]">
                  {proposal.location}
                </p>
              </div>
              {/* Status Badge */}
              {proposal.status === 'ready' ? (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full w-fit" style={{ backgroundColor: 'rgba(45, 114, 85, 0.1)' }}>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#2D7255' }} />
                  <span className="font-sans font-medium text-[12px]" style={{ color: '#2D7255' }}>
                    Ready to book
                  </span>
                </div>
              ) : (
                <div className="bg-grey-light flex items-center gap-1.5 px-2 py-1 rounded-full w-fit">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#737876" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="font-sans text-[12px] text-grey">
                    Waiting for availability
                  </span>
                </div>
              )}
              {/* Review Button */}
              <button
                onClick={onReview}
                className="font-sans bg-primary h-9 px-4 rounded flex items-center justify-center btn-hover-bg w-full mt-3"
              >
                <span className="font-sans font-medium text-[13px] text-primary-foreground">
                  Review proposal
                </span>
              </button>
              
            </div>
          ))}
        </div>

        {/* Data Rows */}
        {rows.map((row, rowIndex) => {
          const isSeparator = 'isSeparator' in row && row.isSeparator;
          
          if (isSeparator) {
            return (
              <div 
                key={row.key} 
                className="flex border-t border-border bg-grey-light/50"
              >
                {/* Label Column */}
                <div className="w-[140px] shrink-0 p-3 bg-grey-light flex items-center sticky left-0 z-10">
                  <span className="font-sans font-medium text-[13px] text-grey tracking-[-0.26px] whitespace-nowrap">
                    {row.label}
                  </span>
                </div>
                
                {/* Empty Columns */}
                {proposals.map((proposal) => (
                  <div 
                    key={proposal.id} 
                    className="w-[280px] shrink-0 p-3 bg-grey-light/50"
                  />
                ))}
              </div>
            );
          }
          
          return (
            <div 
              key={row.key} 
              className={`flex ${rowIndex !== rows.length - 1 ? 'border-t border-border' : 'border-t border-border'}`}
            >
              {/* Label Column */}
              <div className="w-[140px] shrink-0 p-4 bg-background-secondary flex items-center sticky left-0 z-10">
                <span className="font-sans font-medium text-[13px] text-grey tracking-[-0.26px]">
                  {row.label}
                </span>
              </div>
              
              {/* Value Columns */}
              {proposals.map((proposal) => (
                <div 
                  key={proposal.id} 
                  className="w-[280px] shrink-0 p-4 flex items-center"
                >
                  {renderCell(proposal, row.key)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Proposal Card Component
function ProposalCard({ proposal, onReview }: { proposal: Proposal; onReview: () => void }) {
  const isReady = proposal.status === 'ready';
  const images = Array.isArray(proposal.images) ? proposal.images : [proposal.images];

  return (
    <div className="bg-white border border-border rounded p-5 shadow-md w-full">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - All content */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Status Badge */}
          {isReady ? (
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-full w-fit" style={{ backgroundColor: 'rgba(45, 114, 85, 0.1)' }}>
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#2D7255' }} />
              <span className="font-sans font-medium text-[13px] tracking-[-0.13px]" style={{ color: '#2D7255' }}>
                Ready to book
              </span>
            </div>
          ) : (
            <div className="bg-grey-light flex items-center gap-1.5 px-2 py-1.5 rounded-full w-fit">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="font-sans text-[12px] text-grey tracking-[-0.12px]">
                Waiting for availability
              </span>
            </div>
          )}

          {/* Venue Info */}
          <div className="flex flex-col gap-1">
            {!isReady && (
              <p className="font-sans font-medium text-[15px] text-grey tracking-[-0.3px] leading-[1.2]">
                {proposal.location}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-sans font-medium text-[22px] text-black tracking-[-0.44px] leading-[1.2]">
                {proposal.venueName}
              </h3>
              {proposal.additionalVenues && (
                <span className="font-sans font-medium text-[15px] text-grey tracking-[-0.3px]">
                  +{proposal.additionalVenues} venues
                </span>
              )}
            </div>
            {isReady && (
              <p className="font-sans font-medium text-[15px] text-grey tracking-[-0.3px] leading-[1.2]">
                {proposal.location}
              </p>
            )}
          </div>

          {/* Participants and Date */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={UserMultiple02Icon} size={16} color="#212724" strokeWidth={1.5} />
              <span className="font-sans font-medium text-[15px] text-black tracking-[-0.3px] leading-[1.2]">
                {proposal.participants} participants
              </span>
            </div>
            <div className="w-px h-5 bg-border" />
            <div className="flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#212724" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="font-sans font-medium text-[15px] text-black tracking-[-0.3px] leading-[1.2]">
                {proposal.dateRange}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-grey-light" />

          {/* Pricing */}
          <div className="flex flex-col gap-3">
            <p className="font-sans font-medium text-[13px] text-grey tracking-[-0.39px] leading-5">
              Estimated total from
            </p>
            <div className="flex flex-col gap-2">
              <p className="font-sans font-medium text-[22px] text-black tracking-[-0.72px] leading-5">
                {proposal.estimatedTotal} <span className="text-grey">HT</span>
              </p>
              <p className="font-sans font-medium text-[15px] text-grey tracking-[-0.45px] leading-5">
                {proposal.pricePerPerson}
              </p>
            </div>
          </div>

          {/* Divider */}
          {/* <div className="w-full h-px bg-grey-light" /> */}

      

          {/* CTA Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReview}
              className="font-sans bg-primary h-10 px-4 py-3.5 rounded flex items-center justify-center btn-hover-bg"
            >
              <span className="font-sans font-medium text-[14px] text-primary-foreground leading-[1.2]">
                Book
              </span>
            </button>
            <button
              onClick={onReview}
              className="font-sans bg-white border border-border h-10 px-4 py-3.5 rounded flex items-center justify-center btn-hover-bg"
            >
              <span className="font-sans font-medium text-[14px] text-primary-foreground leading-[1.2]">
                Review proposal
              </span>
            </button>
          </div>
        </div>

        {/* Right side - Image(s) */}
        <div className="w-full lg:w-1/2 h-[300px] shrink-0">
          {images.length === 1 ? (
            <img
              src={images[0]}
              alt={proposal.venueName}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-full">
              <div className="row-span-2 relative">
                <img
                  src={images[0]}
                  alt={proposal.venueName}
                  className="absolute inset-0 w-full h-full object-cover rounded-l"
                />
              </div>
              <img
                src={images[1]}
                alt={proposal.venueName}
                className="w-full h-full object-cover rounded-tr"
              />
              <img
                src={images[2]}
                alt={proposal.venueName}
                className="w-full h-full object-cover rounded-br"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton components for progressive loading
function SkeletonPulse({ className }: { className?: string }) {
  return <div className={`animate-pulse-fast bg-grey-light rounded ${className}`} />;
}

function ProjectPageSkeleton() {
  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Navbar Skeleton */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-8 h-[68px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <SkeletonPulse className="w-[70px] h-6" />
            <div className="flex items-center gap-2">
              <SkeletonPulse className="w-16 h-4" />
              <SkeletonPulse className="w-32 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SkeletonPulse className="w-24 h-9 rounded" />
            <SkeletonPulse className="w-10 h-10 rounded-full" />
          </div>
        </div>
      </header>

      <main className="max-w-[1004px] mx-auto px-8 py-8">
        {/* Project Info Skeleton */}
        <div className="flex items-start gap-5 mb-6">
          <SkeletonPulse className="w-[100px] h-[100px] rounded" />
          <div className="flex-1">
            <SkeletonPulse className="w-64 h-7 mb-3" />
            <div className="flex gap-4 mb-4">
              <SkeletonPulse className="w-32 h-5" />
              <SkeletonPulse className="w-32 h-5" />
              <SkeletonPulse className="w-40 h-5" />
            </div>
            <div className="flex gap-2">
              <SkeletonPulse className="w-20 h-7 rounded-full" />
              <SkeletonPulse className="w-20 h-7 rounded-full" />
              <SkeletonPulse className="w-20 h-7 rounded-full" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-5 mb-6">
          <SkeletonPulse className="w-24 h-8" />
          <SkeletonPulse className="w-20 h-8" />
          <SkeletonPulse className="w-24 h-8" />
          <SkeletonPulse className="w-20 h-8" />
        </div>

        {/* Proposal Cards Skeleton */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-border rounded p-5">
              <div className="flex gap-4">
                <SkeletonPulse className="w-[200px] h-[140px] rounded" />
                <div className="flex-1">
                  <div className="flex justify-between mb-3">
                    <div>
                      <SkeletonPulse className="w-48 h-5 mb-2" />
                      <SkeletonPulse className="w-32 h-4" />
                    </div>
                    <SkeletonPulse className="w-24 h-6" />
                  </div>
                  <div className="flex gap-3 mb-4">
                    <SkeletonPulse className="w-28 h-4" />
                    <SkeletonPulse className="w-36 h-4" />
                  </div>
                  <div className="flex gap-2">
                    <SkeletonPulse className="w-20 h-6 rounded-full" />
                    <SkeletonPulse className="w-20 h-6 rounded-full" />
                    <SkeletonPulse className="w-20 h-6 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ProjectPage() {
  // Load saved color palette settings on mount
  useColorPaletteSettings();
  
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'proposals' | 'brief' | 'documents' | 'settings'>('proposals');
  const [vatType, setVatType] = useState<'excl' | 'incl'>('excl');
  const [viewType, setViewType] = useState<'list' | 'map' | 'compare'>('list');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [selectedProposalFilter, setSelectedProposalFilter] = useState<string>('chateau-vaux');
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  // Simulate loading delay for progressive loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll to show/hide sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyNav(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReviewProposal = () => {
    router.push('/proposal');
  };

  const tabs = [
    { id: 'proposals', label: 'Proposals', count: 3 },
    { id: 'brief', label: 'My brief' },
    { id: 'documents', label: 'Documents' },
    { id: 'settings', label: 'Settings' },
  ] as const;

  // Show skeleton while loading
  if (isLoading) {
    return <ProjectPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Sticky Navbar - appears after 150px scroll */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-sm transition-all duration-150 ease-out ${
          showStickyNav 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="max-w-[1004px] mx-auto px-8 h-[56px] flex items-center justify-between">
          {/* Left - Event Name */}
          <div className="flex items-center gap-3">
            <span className="font-sans font-medium text-[15px] text-black tracking-[-0.3px]">
              C-305 - Séminaire d'été 2025
            </span>
          </div>

          {/* Right - Event Details */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={Briefcase01Icon} size={14} className="text-black" strokeWidth={1.5} />
              <span className="font-sans font-medium text-[13px] text-black tracking-[-0.26px]">
                Corporate retreat
              </span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={UserMultiple02Icon} size={14} className="text-black" strokeWidth={1.5} />
              <span className="font-sans font-medium text-[13px] text-black tracking-[-0.26px]">
                160 participants
              </span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={Calendar03Icon} size={14} className="text-black" strokeWidth={1.5} />
              <span className="font-sans font-medium text-[13px] text-black tracking-[-0.26px]">
                May 04 - May 20
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-[1440px] mx-auto px-8 h-[68px] flex items-center justify-between">
          {/* Left - Logo and Breadcrumb */}
          <div className="flex items-center">
            <Link href="/home" className="h-6 w-[70px] relative shrink-0 mb-[5px]">
              <img 
                alt="Naboo logo" 
                className="block max-w-none size-full object-contain" 
                src={imgLogo}
              />
            </Link>
            {/* Gap with divider */}
            <div className="w-[148px] flex items-center justify-center">
              
            </div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <Link href="/home" className="font-sans text-[15px] text-grey tracking-[-0.3px] hover:text-black transition-colors">
                My space
              </Link>
              <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="text-grey" strokeWidth={1.5} />
              <span className="font-sans text-[15px] text-black tracking-[-0.3px]">
                Séminaire d'été 2025
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Submit a brief button - Opens Color Palette Explorer */}
            <button 
              onClick={() => setIsColorPaletteOpen(!isColorPaletteOpen)}
              className={`font-sans hidden sm:flex items-center gap-2.5 h-11 px-4 py-3.5 border rounded shadow-base transition-colors ${
                isColorPaletteOpen 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-white border-black/15 text-black hover:bg-grey-lighterGrey'
              }`}
            >
              <span className="font-sans font-medium text-[15px]">Submit a brief</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>

            {/* Hamburger Menu */}
            <div className="relative" ref={menuRef}>
              <button 
                className="bg-[#eaeae9] flex items-center justify-center rounded-full size-10 shrink-0 hover:bg-[#ddd] transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <HugeiconsIcon icon={Menu01Icon} size={16} color="#212724" strokeWidth={1.5} />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-[220px] bg-white rounded-[12px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.12)] border border-border z-50"
                  style={{ animation: 'menuSlideIn 0.2s ease-out forwards' }}
                >
                  {/* User Name */}
                  <div className="px-4 py-4 border-b border-border">
                    <p className="font-sans font-medium text-[16px] text-black">Maxime Beneteau</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button className="font-sans w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey transition-colors">
                      <HugeiconsIcon icon={UserIcon} size={20} color="#212724" strokeWidth={1.5} />
                      <span className="font-sans font-medium text-[15px] text-black">Account</span>
                    </button>
                    <button className="font-sans w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey transition-colors">
                      <HugeiconsIcon icon={Folder02Icon} size={20} color="#212724" strokeWidth={1.5} />
                      <span className="font-sans font-medium text-[15px] text-black">Projects</span>
                    </button>
                    <button 
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => {
                        setIsColorPaletteOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="font-sans w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey transition-colors cursor-pointer"
                    >
                      <HugeiconsIcon icon={PaintBoardIcon} size={20} color="#212724" strokeWidth={1.5} />
                      <span className="font-sans font-medium text-[15px] text-black">Color & Font</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border mx-4" />

                  {/* Logout */}
                  <div className="py-2 pb-3">
                    <button className="font-sans w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey transition-colors">
                      <HugeiconsIcon icon={Logout03Icon} size={20} color="#212724" strokeWidth={1.5} />
                      <span className="font-sans font-medium text-[15px] text-black">Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Info Section */}
        <div className="max-w-[1004px] mx-auto px-8 pb-0">
          <div className="flex flex-col lg:flex-row justify-between gap-6 py-4">
            {/* Left - Project Details */}
            <div className="flex flex-col gap-3">
              <h1 className="font-sans font-medium text-[26px] text-black tracking-[-0.26px] leading-none">
                C-305 - Séminaire d'été 2025
              </h1>
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1">
                  <HugeiconsIcon icon={Briefcase01Icon} size={14} className="text-black" strokeWidth={1.5} />
                  <span className="font-sans font-medium text-[14px] text-black tracking-[-0.28px] leading-[1.2]">
                    Corporate retreat
                  </span>
                </div>
                <div className="w-px h-5 bg-border" />
                <div className="flex items-center gap-1">
                  <HugeiconsIcon icon={UserMultiple02Icon} size={16} className="text-black" strokeWidth={1.5} />
                  <span className="font-sans font-medium text-[14px] text-black tracking-[-0.28px] leading-[1.2]">
                    160 participants
                  </span>
                </div>
                <div className="w-px h-5 bg-border" />
                <div className="flex items-center gap-1">
                  <HugeiconsIcon icon={Calendar03Icon} size={16} className="text-black" strokeWidth={1.5} />
                  <span className="font-sans font-medium text-[14px] text-black tracking-[-0.28px] leading-[1.2]">
                    May 04 - May 20
                  </span>
                </div>
              </div>
            </div>

            {/* Right - Advisor Info */}
            <div className="flex flex-col gap-2 w-60">
              <p className="font-sans font-medium text-[13px] text-grey leading-5">
                My advisor
              </p>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-grey-light overflow-hidden">
                  <img
                    src="/fake_data/-BfE1765823942802.webp"
                    alt="Advisor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-sans font-medium text-[14px] text-black leading-5">
                    Alexandre Dubois
                  </p>
                  <p className="font-sans font-medium text-[14px] text-grey leading-4">
                    alexandre.dubois@naboo.app
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-5 border-t border-transparent">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 h-[54px] px-2 border-b-[1.5px] transition-colors ${
                  activeTab === tab.id
                    ? 'border-black'
                    : 'border-transparent hover:border-grey-light'
                }`}
              >
                <span
                  className={`font-sans font-medium text-[15px] tracking-[-0.15px] leading-none ${
                    activeTab === tab.id ? 'text-black' : 'text-grey'
                  }`}
                >
                  {tab.label}
                </span>
                {'count' in tab && tab.count && (
                  <div className="bg-primary flex items-center justify-center px-2.5 py-0 rounded-full">
                    <span className="font-sans font-medium text-[14px] text-primary-foreground tracking-[-0.14px]">
                      {tab.count}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1004px] mx-auto px-8 py-4 overflow-visible">
        {/* Tab Content */}
        {activeTab === 'proposals' && (
          <div className="flex flex-col gap-4">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Left Actions */}
              <div className="flex items-center gap-2">
                <div className="bg-black/5 flex gap-1 items-center h-10 p-1 rounded">
                  <button
                    onClick={() => setViewType('list')}
                    className={`flex items-center gap-2 px-2 h-full rounded transition-colors ${
                      viewType === 'list'
                        ? 'bg-white shadow-sm'
                        : 'hover:bg-white/50'
                    }`}
                  >
                    <HugeiconsIcon 
                      icon={Menu09Icon} 
                      size={14} 
                      className={viewType === 'list' ? 'text-black' : 'text-grey'} 
                      strokeWidth={1.5} 
                    />
                    <span
                      className={`font-sans font-medium text-[14px] tracking-[-0.14px] leading-5 ${
                        viewType === 'list' ? 'text-black' : 'text-grey'
                      }`}
                    >
                      List
                    </span>
                  </button>
                  <button
                    onClick={() => setViewType('compare')}
                    className={`flex items-center gap-2 px-2 h-full rounded transition-colors ${
                      viewType === 'compare'
                        ? 'bg-white shadow-sm'
                        : 'hover:bg-white/50'
                    }`}
                  >
                    <HugeiconsIcon 
                      icon={GridViewIcon} 
                      size={14} 
                      className={viewType === 'compare' ? 'text-black' : 'text-grey'} 
                      strokeWidth={1.5} 
                    />
                    <span
                      className={`font-sans font-medium text-[14px] tracking-[-0.14px] leading-5 ${
                        viewType === 'compare' ? 'text-black' : 'text-grey'
                      }`}
                    >
                      Compare
                    </span>
                  </button>
                  <button
                    onClick={() => setViewType('map')}
                    className={`flex items-center gap-2 px-2 h-full rounded transition-colors ${
                      viewType === 'map'
                        ? 'bg-white shadow-sm'
                        : 'hover:bg-white/50'
                    }`}
                  >
                    <HugeiconsIcon 
                      icon={MapsIcon} 
                      size={14} 
                      className={viewType === 'map' ? 'text-black' : 'text-grey'} 
                      strokeWidth={1.5} 
                    />
                    <span
                      className={`font-sans font-medium text-[14px] tracking-[-0.14px] leading-5 ${
                        viewType === 'map' ? 'text-black' : 'text-grey'
                      }`}
                    >
                      Map
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 h-8 px-2 hover:bg-grey-light rounded transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#737876" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span className="font-sans font-medium text-[13px] text-grey leading-5">
                    Export as PDF
                  </span>
                </button>
                <div className="bg-black/5 flex items-center h-10 p-1 rounded">
                  <button
                    onClick={() => setVatType('excl')}
                    className={`flex items-center justify-center px-2 h-full rounded transition-colors ${
                      vatType === 'excl'
                        ? 'bg-white shadow-sm'
                        : 'hover:bg-white/50'
                    }`}
                  >
                    <span
                      className={`font-sans font-medium text-[13px] tracking-[-0.13px] leading-5 ${
                        vatType === 'excl' ? 'text-black' : 'text-grey'
                      }`}
                    >
                      excl. VAT
                    </span>
                  </button>
                  <button
                    onClick={() => setVatType('incl')}
                    className={`flex items-center justify-center px-2 h-full rounded transition-colors ${
                      vatType === 'incl'
                        ? 'bg-white shadow-sm'
                        : 'hover:bg-white/50'
                    }`}
                  >
                    <span
                      className={`font-sans font-medium text-[13px] tracking-[-0.13px] leading-5 ${
                        vatType === 'incl' ? 'text-black' : 'text-grey'
                      }`}
                    >
                      incl. VAT
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Proposals List or Compare View */}
            {viewType === 'compare' ? (
              <div className="w-[calc(100%+400px)] -mr-[400px] overflow-x-auto">
                <CompareView proposals={proposals} onReview={handleReviewProposal} />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {proposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    onReview={handleReviewProposal}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'brief' && (
          <div className="flex flex-col lg:flex-row gap-2">
            {/* Left Side - Event Description (70%) */}
            <div className="lg:w-[70%]">
              <div className="bg-white border border-border rounded p-5 h-full">
                <div className="flex items-center gap-2 mb-3">
                  <HugeiconsIcon icon={FileAttachmentIcon} size={16} className="text-grey" strokeWidth={1.5} />
                  <span className="font-sans font-medium text-[13px] text-grey tracking-[-0.26px]">Event description</span>
                </div>
                <div className="font-sans font-regular text-[14px] text-black leading-relaxed space-y-4">
                  <p>
                    We are organizing an annual corporate retreat for our team of 160 employees from across all departments. 
                    This is one of our most important events of the year, designed to bring together team members who typically 
                    work remotely or in different offices.
                  </p>
                  <p>
                    The primary goals of this retreat are to strengthen team bonds, celebrate our achievements from the past year, 
                    and collaboratively plan for the future. We want to create an environment that fosters both professional 
                    development and personal connections among colleagues.
                  </p>
                  <p>
                    We're looking for a venue that can accommodate various activities including:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Large plenary sessions for company-wide presentations</li>
                    <li>Breakout rooms for department-specific workshops</li>
                    <li>Team-building activities both indoors and outdoors</li>
                    <li>Evening entertainment and social gatherings</li>
                    <li>Comfortable dining facilities for all meals</li>
                  </ul>
                  <p>
                    Ideally, the venue should have extensive outdoor spaces for activities and relaxation, be easily accessible 
                    from Paris (within 1-2 hours), and offer on-site accommodation for all participants. We prefer a location 
                    with a blend of modern amenities and natural surroundings to help our team disconnect from daily work 
                    pressures while remaining comfortable.
                  </p>
                  <p>
                    Previous retreats have been held at countryside châteaux and modern conference centers, and we're open to 
                    similar options that can provide a memorable experience for our team.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Event Info (30%) */}
            <div className="lg:w-[30%]">
              <div className="bg-white border border-border rounded p-5 flex flex-col gap-5">
                {/* Event Type */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HugeiconsIcon icon={Target01Icon} size={16} className="text-grey" strokeWidth={1.5} />
                    <span className="font-sans font-medium text-[13px] text-grey tracking-[-0.26px]">Event type</span>
                  </div>
                  <p className="font-sans font-medium text-[15px] text-black">Corporate retreat</p>
                </div>

                {/* Participants */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HugeiconsIcon icon={UserMultiple02Icon} size={16} className="text-grey" strokeWidth={1.5} />
                    <span className="font-sans font-medium text-[13px] text-grey tracking-[-0.26px]">Number of participants</span>
                  </div>
                  <p className="font-sans font-medium text-[15px] text-black">160 people</p>
                </div>

                {/* Dates */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HugeiconsIcon icon={Calendar03Icon} size={16} className="text-grey" strokeWidth={1.5} />
                    <span className="font-sans font-medium text-[13px] text-grey tracking-[-0.26px]">Event dates</span>
                  </div>
                  <p className="font-sans font-medium text-[15px] text-black">May 04, 2025 - May 20, 2025</p>
                  <p className="font-sans text-[13px] text-grey mt-1">16 days</p>
                </div>

                {/* Location */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HugeiconsIcon icon={Location01Icon} size={16} className="text-grey" strokeWidth={1.5} />
                    <span className="font-sans font-medium text-[13px] text-grey tracking-[-0.26px]">Preferred location</span>
                  </div>
                  <p className="font-sans font-medium text-[15px] text-black">Île-de-France, France</p>
                  <p className="font-sans text-[13px] text-grey mt-1">Within 100km of Paris</p>
                </div>

                {/* Budget */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HugeiconsIcon icon={MoneyBag02Icon} size={16} className="text-grey" strokeWidth={1.5} />
                    <span className="font-sans font-medium text-[13px] text-grey tracking-[-0.26px]">Budget</span>
                  </div>
                  <p className="font-sans font-medium text-[15px] text-black">25 000 € - 35 000 €</p>
                  <p className="font-sans text-[13px] text-grey mt-1">~200 € per person</p>
                </div>

                {/* Services needed */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HugeiconsIcon icon={Briefcase01Icon} size={16} className="text-grey" strokeWidth={1.5} />
                    <span className="font-sans font-medium text-[13px] text-grey tracking-[-0.26px]">Services needed</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-grey-light rounded-full font-sans text-[13px] text-black">Venue</span>
                    <span className="px-2.5 py-1 bg-grey-light rounded-full font-sans text-[13px] text-black">Catering</span>
                    <span className="px-2.5 py-1 bg-grey-light rounded-full font-sans text-[13px] text-black">Activities</span>
                    <span className="px-2.5 py-1 bg-grey-light rounded-full font-sans text-[13px] text-black">Staff</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="flex flex-col gap-4">
            {/* Proposal Filter */}
            <div className="flex items-center gap-3">
              <span className="font-sans font-medium text-[13px] text-grey">Filter by proposal:</span>
              <select
                value={selectedProposalFilter}
                onChange={(e) => setSelectedProposalFilter(e.target.value)}
                className="h-9 px-3 pr-8 bg-white border border-border rounded font-sans text-[14px] text-black appearance-none cursor-pointer hover:border-grey transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23737876' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
              >
                <option value="all">All proposals</option>
                <option value="chateau-vaux">Château de Vaux-le-Vicomte</option>
                <option value="domaine-chantilly">Domaine de Chantilly</option>
                <option value="palace-versailles">Palace of Versailles</option>
              </select>
            </div>

            {/* Documents List */}
            <div className="bg-white border border-border rounded overflow-hidden">
              {/* Document Item 1 */}
              <div className="flex items-center justify-between p-4 border-b border-border hover:bg-grey-lighterGrey transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-border rounded-lg flex items-center justify-center">
                    <HugeiconsIcon icon={File01Icon} size={20} className="text-grey" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-sans font-medium text-[14px] text-black">Event_Brief_2025.pdf</p>
                    <p className="font-sans text-[12px] text-grey">2.4 MB • Uploaded Jan 15, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-grey-light rounded transition-colors">
                    <HugeiconsIcon icon={Download04Icon} size={18} className="text-grey" strokeWidth={1.5} />
                  </button>
                  <button className="p-2 hover:bg-grey-light rounded transition-colors">
                    <HugeiconsIcon icon={Delete02Icon} size={18} className="text-grey" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Document Item 2 */}
              <div className="flex items-center justify-between p-4 border-b border-border hover:bg-grey-lighterGrey transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-border rounded-lg flex items-center justify-center">
                    <HugeiconsIcon icon={Image01Icon} size={20} className="text-grey" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-sans font-medium text-[14px] text-black">Company_Logo.png</p>
                    <p className="font-sans text-[12px] text-grey">856 KB • Uploaded Jan 15, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-grey-light rounded transition-colors">
                    <HugeiconsIcon icon={Download04Icon} size={18} className="text-grey" strokeWidth={1.5} />
                  </button>
                  <button className="p-2 hover:bg-grey-light rounded transition-colors">
                    <HugeiconsIcon icon={Delete02Icon} size={18} className="text-grey" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Document Item 3 */}
              <div className="flex items-center justify-between p-4 border-b border-border hover:bg-grey-lighterGrey transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-border rounded-lg flex items-center justify-center">
                    <HugeiconsIcon icon={FileAttachmentIcon} size={20} className="text-grey" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-sans font-medium text-[14px] text-black">Budget_Breakdown.xlsx</p>
                    <p className="font-sans text-[12px] text-grey">1.2 MB • Uploaded Jan 16, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-grey-light rounded transition-colors">
                    <HugeiconsIcon icon={Download04Icon} size={18} className="text-grey" strokeWidth={1.5} />
                  </button>
                  <button className="p-2 hover:bg-grey-light rounded transition-colors">
                    <HugeiconsIcon icon={Delete02Icon} size={18} className="text-grey" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Document Item 4 */}
              <div className="flex items-center justify-between p-4 hover:bg-grey-lighterGrey transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-border rounded-lg flex items-center justify-center">
                    <HugeiconsIcon icon={File01Icon} size={20} className="text-grey" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-sans font-medium text-[14px] text-black">Venue_Comparison.pdf</p>
                    <p className="font-sans text-[12px] text-grey">4.8 MB • Uploaded Jan 18, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-grey-light rounded transition-colors">
                    <HugeiconsIcon icon={Download04Icon} size={18} className="text-grey" strokeWidth={1.5} />
                  </button>
                  <button className="p-2 hover:bg-grey-light rounded transition-colors">
                    <HugeiconsIcon icon={Delete02Icon} size={18} className="text-grey" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-grey-light rounded-full flex items-center justify-center">
                <HugeiconsIcon icon={Add01Icon} size={24} className="text-grey" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="font-sans font-medium text-[14px] text-black">Drop files here or click to upload</p>
                <p className="font-sans text-[12px] text-grey mt-1">PDF, DOC, XLS, PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="flex flex-col gap-4">
            {/* Team Access */}
            <div className="bg-white border border-border rounded overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={UserMultiple02Icon} size={18} className="text-black" strokeWidth={1.5} />
                  <p className="font-sans font-medium text-[15px] text-black">Team access</p>
                </div>
                <button className="flex items-center gap-2 h-8 px-3 bg-white border border-border rounded hover:bg-grey-lighterGrey transition-colors">
                  <HugeiconsIcon icon={Add01Icon} size={14} className="text-black" strokeWidth={1.5} />
                  <span className="font-sans font-medium text-[12px] text-black">Add member</span>
                </button>
              </div>

              {/* Team member 1 */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="font-sans font-medium text-[12px] text-primary-foreground">MB</span>
                  </div>
                  <div>
                    <p className="font-sans font-medium text-[14px] text-black">Maxime Beneteau</p>
                    <p className="font-sans text-[12px] text-grey">maxime@company.com • Owner</p>
                  </div>
                </div>
              </div>

              {/* Team member 2 */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-info rounded-full flex items-center justify-center">
                    <span className="font-sans font-medium text-[12px] text-white">JD</span>
                  </div>
                  <div>
                    <p className="font-sans font-medium text-[14px] text-black">Jean Dupont</p>
                    <p className="font-sans text-[12px] text-grey">jean@company.com • Editor</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-grey-light rounded transition-colors">
                  <HugeiconsIcon icon={Delete02Icon} size={16} className="text-grey" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Color Palette Explorer */}
      <ColorPaletteExplorer 
        isOpen={isColorPaletteOpen} 
        onClose={() => setIsColorPaletteOpen(false)} 
      />
    </div>
  );
}
