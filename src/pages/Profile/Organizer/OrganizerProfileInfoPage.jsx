import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Title } from "react-head";
import { Users, Globe, Instagram, Facebook, Twitter, Linkedin, Youtube, Calendar } from "lucide-react";
import { toast } from "sonner";

import { getOrganizerPublicProfile } from "../../../APIs/organizerAPI";
import { followOrganizer, unfollowOrganizer } from "../../../APIs/userAPIs";
import { useUser } from "../../../Context/AuthProvider";
import { handleError } from "../../../utils/errorHandler";

import NavigationBar from "../../../components/Layout/NavigationBar";
import Footer from "../../../components/Layout/Footer";
import Loading from "../../../components/Layout/LoadingLayout";
import Card from "../../../components/UI/Card";
import { Button } from "../../../components/shadcn/button";

export default function OrganizerProfileInfoPage() {
  const { id: organizerId } = useParams();
  const { t } = useTranslation();
  const { user } = useUser();
  
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrganizerPublicProfile(organizerId);
      setOrganizer(response.data?.data?.organizer);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [organizerId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFollowToggle = async () => {
    if (!user || Object.keys(user).length === 0) {
      toast.error(t("apiErrors.UNAUTHORIZED"));
      return;
    }

    try {
      setFollowLoading(true);
      if (organizer.isFollowing) {
        await unfollowOrganizer(organizerId);
        setOrganizer(prev => ({
          ...prev,
          isFollowing: false,
          followerCount: Math.max(0, prev.followerCount - 1)
        }));
        toast.success(t("events.details.unfollowed") || "Unfollowed organizer");
      } else {
        await followOrganizer(organizerId);
        setOrganizer(prev => ({
          ...prev,
          isFollowing: true,
          followerCount: prev.followerCount + 1
        }));
        toast.success(t("events.details.followed") || "Following organizer!");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!organizer) return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-500">{t("common.errors.notFound") || "Organizer not found"}</p>
      </div>
      <Footer />
    </div>
  );

  const socialLinks = [
    { icon: Globe, url: organizer.websiteUrl, label: t("upgradeToOrganizer.social.platforms.websiteUrl") },
    { icon: Instagram, url: organizer.instagramUrl, label: t("upgradeToOrganizer.social.platforms.instagramUrl") },
    { icon: Facebook, url: organizer.facebookUrl, label: t("upgradeToOrganizer.social.platforms.facebookUrl") },
    { icon: Twitter, url: organizer.twitterUrl, label: t("upgradeToOrganizer.social.platforms.twitterUrl") },
    { icon: Linkedin, url: organizer.linkedinUrl, label: t("upgradeToOrganizer.social.platforms.linkedinUrl") },
    { icon: Youtube, url: organizer.youtubeUrl, label: t("upgradeToOrganizer.social.platforms.youtubeUrl") },
  ].filter(link => link.url);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavigationBar />
      <Title>{organizer.name}</Title>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-48 sm:h-64 bg-slate-200 relative">
            {organizer.coverUrl ? (
              <img 
                src={organizer.coverUrl} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secandry/20" />
            )}
          </div>

          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 -mt-12 sm:-mt-16 mb-4 sm:mb-0">
              {/* Logo */}
              <div className="size-24 sm:size-32 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden shrink-0">
                <img 
                  src={organizer.logoUrl || "/FLogo.png"} 
                  alt={organizer.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Stats */}
              <div className="flex-1 flex flex-col pt-2 sm:pt-16">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{organizer.name}</h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    <strong>{organizer.followerCount}</strong> {t("profile.organizer.followers") || "Followers"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {t("profile.organizer.joined") || "Joined"} {new Date(organizer.createdAt).getFullYear()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:pt-16">
                <Button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  variant={organizer.isFollowing ? "outline" : "default"}
                  className="px-8 font-semibold"
                >
                  {followLoading ? "..." : (organizer.isFollowing ? t("events.details.unfollow") || "Unfollow" : `+ ${t("events.details.follow") || "Follow"}`)}
                </Button>
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-6">
                {socialLinks.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-slate-50 text-slate-600 hover:text-primary hover:bg-primary/5 transition-all"
                    title={link.label}
                  >
                    <link.icon size={20} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: About */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">{t("profile.organizer.about") || "About"}</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                {organizer.description || t("profile.organizer.noDescription") || "No description available."}
              </p>
            </div>
          </div>

          {/* Right Column: Events */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900">{t("profile.organizer.events") || "Events"}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {organizer.events?.length > 0 ? (
                organizer.events.map((event) => (
                  <Card
                    key={event.id}
                    bannerUrl={event.bannerUrl}
                    title={event.title}
                    description={event.description}
                    date={event.date}
                    price={event.ticketTypes || []}
                    views={event.views}
                    id={event.id}
                    slug={event.slug}
                    sessions={event.eventSessions || []}
                    isInterested={event.isInterested}
                    interestedCount={event.interestedCount}
                  />
                ))
              ) : (
                <div className="col-span-full bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                  <Calendar className="mx-auto text-slate-300 mb-2" size={48} />
                  <p className="text-slate-500">{t("profile.organizer.noEvents") || "No upcoming events yet."}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
