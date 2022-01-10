import { useEffect, useState } from "react"
import StarBallot from "./StarBallot";
import Button from "./Button";
import useFetch from "../useFetch";
import { useParams } from "react-router";
import React from 'react'
import { useNavigate } from "react-router";

const VotePage = ({ }) => {
    const {id} = useParams();
    const {data: election, isPending, error} = useFetch(`/API/Election/${id}`)
    const [rankings, setRankings] = useState([])
    const navigate = useNavigate();
    console.log(election)
    const onUpdate = (rankings) => {
        setRankings(rankings)
        console.log(rankings)}
    const submit = () => {
        console.log(election)
        console.log(election.Candidates)
        console.log(rankings)
        const message = {
            ElectionID: id,
            candidateScores: election.polls[0].candidates.map((candidate,i) => 
              ({'id': election.polls[0].candidates[i].candidateId, 'score':rankings[i]})
            )
          }
          console.log(message)
          fetch(`/API/Election/${id}`,{
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
          }).then(
            navigate(`/ElectionResults/${id}`)
          )
          
    }
    return (
        <div>
            <>
            { error && <div> {error} </div>}
            { isPending && <div> Loading Election... </div>}
            {election && 
                <StarBallot
                race = {election.title}
                candidates = {election.polls[0].candidates}
                onUpdate = {onUpdate}
                defaultRankings = {Array(election.polls[0].candidates.length).fill(0)}
                readonly = {false}
            />}
            {election && <Button 
                text= 'Submit'
                onClick = {submit}
            />}

                </>
        </div>
    )
}

export default VotePage
