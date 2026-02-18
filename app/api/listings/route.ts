/**
 * API Route: /api/listings
 *
 * Handles filtering queries with GET and POST methods.
 * Supports both GET (query params) and POST (JSON body) for flexibility.
 *
 * GET Query Params:
 * ?type=business_sale&country=UAE&industry=Food%20%26%20Beverage&city=Dubai&price_min=100000&price_max=500000&sort=newest&page=1&pageSize=12
 *
 * POST Body:
 * {
 *   type: "business_sale" | "franchise_sale",
 *   country?: string,
 *   industry?: string,
 *   filters?: {
 *     city?: string,
 *     price_min?: number,
 *     price_max?: number,
 *     sort?: "newest" | "price_low" | "price_high",
 *   },
 *   page?: number,
 *   pageSize?: number
 * }
 */

import { NextRequest, NextResponse } from "next/server";

// Mock listing data with comprehensive entries
const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Coffee Shop - Downtown",
    type: "business_sale",
    country: "UAE",
    industry: "Food & Beverage",
    city: "Dubai",
    price: 150000,
    revenue: 500000,
    profit: 85000,
    image: "https://via.placeholder.com/400x300?text=Coffee+Shop",
    description: "Well-established coffee shop in premium location",
  },
  {
    id: "2",
    title: "Tech Consulting Firm",
    type: "business_sale",
    country: "USA",
    industry: "Technology",
    city: "San Francisco",
    price: 450000,
    revenue: 1200000,
    profit: 320000,
    image: "https://via.placeholder.com/400x300?text=Tech+Firm",
    description: "Growing IT consulting business with 15+ clients",
  },
  {
    id: "3",
    title: "McDonald's Franchise",
    type: "franchise_sale",
    country: "UAE",
    industry: "Food & Beverage",
    city: "Abu Dhabi",
    price: 800000,
    revenue: 2500000,
    profit: 450000,
    image: "https://via.placeholder.com/400x300?text=McDonalds",
    description: "Established McDonald's franchise with high ROI",
  },
  {
    id: "4",
    title: "Retail Store - Mall Location",
    type: "business_sale",
    country: "UAE",
    industry: "Retail",
    city: "Dubai",
    price: 200000,
    revenue: 600000,
    profit: 120000,
    image: "https://via.placeholder.com/400x300?text=Retail+Store",
    description: "Successful retail store in prime mall location",
  },
  {
    id: "5",
    title: "Gym & Fitness Centre",
    type: "franchise_sale",
    country: "USA",
    industry: "Health & Wellness",
    city: "Los Angeles",
    price: 500000,
    revenue: 1800000,
    profit: 350000,
    image: "https://via.placeholder.com/400x300?text=Gym",
    description: "Thriving fitness franchise with established membership base",
  },
  {
    id: "6",
    title: "Restaurant - Fine Dining",
    type: "business_sale",
    country: "USA",
    industry: "Food & Beverage",
    city: "New York",
    price: 350000,
    revenue: 1500000,
    profit: 250000,
    image: "https://via.placeholder.com/400x300?text=Restaurant",
    description: "Award-winning restaurant with loyal clientele",
  },
  {
    id: "7",
    title: "Beauty Salon Franchise",
    type: "franchise_sale",
    country: "UAE",
    industry: "Beauty & Wellness",
    city: "Dubai",
    price: 250000,
    revenue: 650000,
    profit: 145000,
    image: "https://via.placeholder.com/400x300?text=Salon",
    description: "Premium beauty salon with proven business model",
  },
  {
    id: "8",
    title: "Digital Marketing Agency",
    type: "business_sale",
    country: "USA",
    industry: "Marketing",
    city: "New York",
    price: 200000,
    revenue: 800000,
    profit: 180000,
    image: "https://via.placeholder.com/400x300?text=Marketing",
    description: "Full-service digital marketing agency with 25+ clients",
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const type = searchParams.get("type") as string | null;
    const country = searchParams.get("country") as string | null;
    const industry = searchParams.get("industry") as string | null;
    const city = searchParams.get("city") as string | null;
    const priceMin = searchParams.get("price_min") as string | null;
    const priceMax = searchParams.get("price_max") as string | null;
    const sort = searchParams.get("sort") as string | null;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");

    // Filter listings
    let filtered = MOCK_LISTINGS.filter((listing) => {
      if (type && listing.type !== type) return false;
      if (country && listing.country.toLowerCase() !== country.toLowerCase())
        return false;
      if (industry && listing.industry.toLowerCase() !== industry.toLowerCase())
        return false;
      if (city && !listing.city.toLowerCase().includes(city.toLowerCase()))
        return false;
      if (priceMin && listing.price < parseInt(priceMin)) return false;
      if (priceMax && listing.price > parseInt(priceMax)) return false;

      return true;
    });

    // Sort
    switch (sort) {
      case "price_low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        filtered.reverse();
        break;
    }

    // Paginate
    const totalPages = Math.ceil(filtered.length / pageSize);
    const start = (page - 1) * pageSize;
    const paginatedData = filtered.slice(start, start + pageSize);

    return NextResponse.json({
      success: true,
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        total: filtered.length,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Listing API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      type,
      country,
      industry,
      filters,
      page = 1,
      pageSize = 12,
    } = await request.json();

    // Filter listings
    let filtered = MOCK_LISTINGS.filter((listing) => {
      if (type && listing.type !== type) return false;
      if (country && listing.country !== country) return false;
      if (industry && listing.industry !== industry) return false;

      if (filters) {
        if (
          filters.city &&
          !listing.city.toLowerCase().includes(filters.city.toLowerCase())
        )
          return false;
        if (filters.price_min && listing.price < parseInt(filters.price_min))
          return false;
        if (filters.price_max && listing.price > parseInt(filters.price_max))
          return false;
      }

      return true;
    });

    // Sort
    if (filters?.sort) {
      switch (filters.sort) {
        case "price_low":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price_high":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "newest":
          filtered.reverse();
          break;
      }
    }

    // Paginate
    const totalPages = Math.ceil(filtered.length / pageSize);
    const start = (page - 1) * pageSize;
    const paginatedData = filtered.slice(start, start + pageSize);

    return NextResponse.json({
      success: true,
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        total: filtered.length,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Listing API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
