import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/config/mongodb';
import Report from '../../../models/reportsSchema';

// put request
export async function PUT(request: NextRequest) {
  try {
    await connectMongoDB();

    const id = request.nextUrl.pathname.split('/').pop();
    const { logoURL, notes, summary } = await request.json(); 

    const updateData: any = {};
    if (logoURL !== undefined) updateData.logoURL = logoURL;
    if (notes !== undefined) updateData.notes = notes;
    if (summary !== undefined) updateData.summary = summary; 

    const updatedReport = await Report.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedReport) {
      return NextResponse.json({ message: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json(updatedReport, { status: 200 });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// get request
export async function GET(request: NextRequest) {
    try {
      await connectMongoDB();
  
      const id = request.nextUrl.pathname.split('/').pop(); 
  
      if (!id) {
        return NextResponse.json({ message: 'Missing report ID' }, { status: 400 });
      }
  
      const report = await Report.findById(id);
  
      if (!report) {
        return NextResponse.json({ message: 'Report not found' }, { status: 404 });
      }
  
      return NextResponse.json(report, { status: 200 });
    } catch (error) {
      console.error('Error fetching report:', error);
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
  }
  
  // delete request
  export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const reportId = params.id;
  
    try {
      
      await connectMongoDB(); 
      const deletedReport = await Report.findByIdAndDelete(reportId);

      if (!deletedReport) {
        return NextResponse.json({ message: 'Report not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Report deleted successfully' }, { status: 200 });
      
    } catch (error) {
      console.error('Error deleting report:', error);
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
  }