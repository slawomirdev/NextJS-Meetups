import React from 'react'
import MeetupDetail from '../../components/meetups/MeetupDetail'
import { MongoClient, ObjectId } from 'mongodb'
import Head from 'next/head'

const MeetupDetails = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  )
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.REACT_APP_USER}:${process.env.REACT_APP_PASS}@cluster0.d9lyi.mongodb.net/meetups?retryWrites=true&w=majority`,
    { useUnifiedTopology: true }
  )
  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray()

  client.close()

  return {
    fallback: 'blocking',
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  }
}

export async function getStaticProps(context) {
  //fetch data

  const meetupId = context.params.meetupId

  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.REACT_APP_USER}:${process.env.REACT_APP_PASS}@cluster0.d9lyi.mongodb.net/meetups?retryWrites=true&w=majority`,
    { useUnifiedTopology: true }
  )
  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  })

  client.close()

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.data.title,
        address: selectedMeetup.data.address,
        image: selectedMeetup.data.image,
        description: selectedMeetup.data.description,
      },
    },
  }
}

export default MeetupDetails
